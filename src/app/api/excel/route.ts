import { NextResponse } from "next/server";
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
    try {
        const workbook = new ExcelJS.Workbook();

        let columns = null;

        const wb = await workbook.xlsx.load(buffer);

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
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
