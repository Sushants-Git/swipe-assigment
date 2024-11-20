import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dedent from "dedent";

type HeaderRow =
    | ExcelJS.CellValue[]
    | {
          [key: string]: ExcelJS.CellValue;
      };

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

        const wb = await workbook.xlsx.load(buffer);

        const { headerRow, headerRowNumber, gapAt } = getSheetDetails(wb);
        const randomRows = getRandomRows(wb, headerRowNumber + 1, gapAt, 3);

        await getMappingFromAI(headerRow, randomRows);

        return NextResponse.json({
            Message: "Success",
            status: 201,
        });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};

async function getMappingFromAI(
    headerRow: HeaderRow | null,
    randomRows: ExcelJS.Row[],
) {
    // const prompt = dedent`
    // I have a input table with columns ${JSON.stringify(headerRow)} and here are some of it's rows \
    // ${randomRows.map((row) => `${JSON.stringify(row.values)} \n`)}.

    // I want to map this tables columns into three tables Invoices, Products and Customers columns. There schema is as follows :
    // Invoice {
    //     serialNumber: string;
    //     customerName: string;
    //     productName: string;
    //     qty: number;
    //     tax: number;
    //     totalAmount: number;
    //     date: string;
    // }

    // Customer {
    //     name: string;
    //     phoneNumber: number;
    //     totalPurchaseAmount: number;
    //     email: string;
    //     lastPurchaseDate: string;
    // }

    // Product {
    //     name: string;
    //     quantity: number;
    //     unitPrice: number;
    //     tax: number;
    //     priceWithTax: number;
    //     discount: number;
    //     serialNumber: string;
    // }.

    // respond only with a json object like
    // "mapping": {
    //      "Invoices": [
    //        {
    //          "sourceColumnName": ,
    //           "targetColumnName",
    //        },
    //        ...remaining
    //      ],
    //      "Customers": [
    //        {
    //          "sourceColumnName": ,
    //         "targetColumnName",
    //        },
    //        ...remaining
    //      ],
    //      "Products": [
    //        {
    //          "sourceColumnName": ,
    //          "targetColumnName": ,
    //        },
    //        ...remaining
    //      ]
    // },
    // that represents this mapping.

    // It is not necessary that all columns will get mapped.
    // do not include anything except the json ouptut not even '''json.
    // `;

    const prompt = dedent`
Given a source table with the following structure:
- Headers: ${JSON.stringify(headerRow)} 
- Sample data: ${randomRows.map((row) => `${JSON.stringify(row.values)} \n`)}

Create a column mapping to transform this source data into the following target tables:

1. Invoice Table Schema:
   {
     serialNumber: string,
     customerName: string,
     productName: string,
     qty: number,
     tax: number,
     totalAmount: number,
     date: string
   }

2. Customer Table Schema:
   {
     name: string,
     phoneNumber: number,
     totalPurchaseAmount: number,
     email: string,
     lastPurchaseDate: string
   }

3. Product Table Schema:
   {
     name: string,
     quantity: number,
     unitPrice: number,
     tax: number,
     priceWithTax: number,
     discount: number,
     serialNumber: string
   }

Requirements:
- Return only a JSON mapping object without any additional text or markdown
- Not all source columns need to be mapped
- Each mapping should follow this structure:
  {
    "mapping": {
      "Invoices": [
        {
          "sourceColumnName": string,
          "targetColumnName": string
        }
      ],
      "Customers": [...],
      "Products": [...]
    }
  }
`;

    console.log(prompt);

    if (process.env.GOOGLE_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return NextResponse.json({
            output: result.response.text(),
        });
    }
}

function getRandomRows(
    wb: ExcelJS.Workbook,
    start: number,
    end: number,
    howMany: number,
): ExcelJS.Row[] {
    const selectedRows: ExcelJS.Row[] = [];

    wb.eachSheet((sheet) => {
        let firstNonEmptyRowIndex = start;
        for (let i = start; i < end; i++) {
            const row = sheet.getRow(i);
            if (row.cellCount > 0) {
                firstNonEmptyRowIndex = i;
                selectedRows.push(row);
                break;
            }
        }

        const totalAvailableRows = end - firstNonEmptyRowIndex;
        const interval = Math.floor(totalAvailableRows / howMany);

        for (let i = 1; i < howMany; i++) {
            const rowIndex = firstNonEmptyRowIndex + interval * i;
            const row = sheet.getRow(rowIndex);
            if (row.cellCount > 0) {
                selectedRows.push(row);
            }
        }
    });

    return selectedRows;
}

function getSheetDetails(wb: ExcelJS.Workbook): {
    headerRow: HeaderRow | null;
    headerRowNumber: number;
    gapAt: number;
} {
    let headerRow: HeaderRow | null = null;
    let headerRowNumber = -1;
    let headerFound = false;

    let gapAt = -1;
    let foundGap = false;

    let val = null;
    let rightBehindVal: number | null = null;

    wb.eachSheet((sheet) => {
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (!headerFound) {
                headerRow = row.values;
                headerRowNumber = rowNumber;
                headerFound = true;
            }

            if (!foundGap) {
                val = rowNumber;

                if (val && rightBehindVal) {
                    if (val - rightBehindVal !== 1) {
                        gapAt = rightBehindVal + 1;
                        foundGap = true;
                    }
                }

                rightBehindVal = val;
            }
        });
    });

    return { headerRow, headerRowNumber, gapAt };
}
