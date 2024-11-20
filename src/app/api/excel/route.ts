import { NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import ExcelJS from "exceljs";

export const POST = async (req: Request) => {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    if (!file) {
        return NextResponse.json(
            { error: "No files received." },
            { status: 400 },
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    try {
        const filePath = path.join(process.cwd(), "public/files/");
        if (!existsSync(filePath)) {
            await mkdir(filePath, { recursive: true });
        }
        const writeToPath = path.join(filePath, filename);
        await writeFile(writeToPath, buffer);

        const workbook = new ExcelJS.Workbook();

        let columns = null;

        const wb = await workbook.xlsx.readFile(writeToPath);

        wb.eachSheet((sheet) => {
            sheet.eachRow({ includeEmpty: false }, function (row, index) {
                if (index === 1) {
                    columns = row.values;
                }
            });
        });

        return NextResponse.json({
            Message: JSON.stringify(columns),
            status: 201,
        });
        // return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
