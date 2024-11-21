import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dedent from "dedent";

type Row =
    | ExcelJS.CellValue[]
    | {
          [key: string]: ExcelJS.CellValue;
      };

export const POST = async (req: Request) => {
    const {
        headerRow,
        randomRows,
    }: { headerRow: Row | null; randomRows: Row[] } = await req.json();

    try {
        try {
            const mapping = await getMappingFromAI(headerRow, randomRows);
            const mapping2 = {
                mapping: {
                    Invoices: [
                        {
                            sourceColumnName: "Serial Number",
                            targetColumnName: "serialNumber",
                        },
                        {
                            sourceColumnName: "Party Name",
                            targetColumnName: "customerName",
                        },
                        {
                            sourceColumnName: "Product Name",
                            targetColumnName: "productName",
                        },
                        { sourceColumnName: "Qty", targetColumnName: "qty" },
                        {
                            sourceColumnName: "Tax (%)",
                            targetColumnName: "tax",
                        },
                        {
                            sourceColumnName: "Item Total Amount",
                            targetColumnName: "totalAmount",
                        },
                        {
                            sourceColumnName: "Invoice Date",
                            targetColumnName: "date",
                        },
                    ],
                    Customers: [
                        {
                            sourceColumnName: "Party Name",
                            targetColumnName: "name",
                        },
                        {
                            sourceColumnName: "Phone Number",
                            targetColumnName: "phoneNumber",
                        },
                    ],
                    Products: [
                        {
                            sourceColumnName: "Product Name",
                            targetColumnName: "name",
                        },
                        {
                            sourceColumnName: "Qty",
                            targetColumnName: "quantity",
                        },
                        {
                            sourceColumnName: "Price with Tax",
                            targetColumnName: "priceWithTax",
                        },
                        {
                            sourceColumnName: "Tax (%)",
                            targetColumnName: "tax",
                        },
                        {
                            sourceColumnName: "Serial Number",
                            targetColumnName: "serialNumber",
                        },
                    ],
                },
            };
            // const mapping = {
            //     mapping: {
            //         Invoices: [
            //             {
            //                 sourceColumnName: "Serial Number",
            //                 targetColumnName: "serialNumber",
            //             },
            //             {
            //                 sourceColumnName: "Party Name",
            //                 targetColumnName: "customerName",
            //             },
            //             {
            //                 sourceColumnName: "Total Amount",
            //                 targetColumnName: "totalAmount",
            //             },
            //             {
            //                 sourceColumnName: "Date",
            //                 targetColumnName: "date",
            //             },
            //             {
            //                 sourceColumnName: "Tax Amount",
            //                 targetColumnName: "tax",
            //             },
            //         ],
            //         Customers: [
            //             {
            //                 sourceColumnName: "Party Name",
            //                 targetColumnName: "name",
            //             },
            //             {
            //                 sourceColumnName: "Total Amount",
            //                 targetColumnName: "totalPurchaseAmount",
            //             },
            //             {
            //                 sourceColumnName: "Date",
            //                 targetColumnName: "lastPurchaseDate",
            //             },
            //         ],
            //         Products: [
            //             {
            //                 sourceColumnName: "Party Company Name",
            //                 targetColumnName: "name",
            //             },
            //             {
            //                 sourceColumnName: "Serial Number",
            //                 targetColumnName: "serialNumber",
            //             },
            //             {
            //                 sourceColumnName: "Net Amount",
            //                 targetColumnName: "priceWithTax",
            //             },
            //             {
            //                 sourceColumnName: "Tax Amount",
            //                 targetColumnName: "tax",
            //             },
            //         ],
            //     },
            // };

            const som = () => {
                return new Promise((res) => {
                    setTimeout(() => {
                        res("lol");
                    }, 2000);
                });
            };

            await som();

            return NextResponse.json(
                {
                    message: "Mapping retrieved successfully",
                    status: 201,
                    mapping: mapping.mapping,
                },
                { status: 201 },
            );
        } catch (error) {
            console.log(`getMappingFromAI errored with -> ${error}`);
            return NextResponse.json(
                {
                    error: "Failed to retrieve mapping from AI",
                },
                { status: 500 },
            );
        }
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};

async function getMappingFromAI(headerRow: Row | null, randomRows: Row[]) {
    const prompt = dedent`
Given a source table with the following structure:
- Headers: ${JSON.stringify(headerRow)} 
- Sample data: \n${randomRows.map((row) => `${JSON.stringify(row)} \n`).join("")}

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
- Return only a JSON mapping object without any additional text or markdown (like \`\`\`json)
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

Output in JSON format.

Do not use markdown.

DO NOT INCLUDE BACKTICKS IN THE RESPONSE

JSON:

`;
    let mapping = null;

    if (process.env.GOOGLE_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const res = result.response.text();

        if (res.includes("json")) {
            mapping = removeBackticksAndJson(res);
        } else {
            mapping = res;
        }
    }

    if (mapping) {
        mapping = JSON.parse(mapping);
        return mapping;
    }

    throw new Error("Unable to generate Mapping");
}

function removeBackticksAndJson(input: string) {
    return input.replace(/`/g, "").replace(/json/gi, "");
}

// function getRandomRows(
//     wb: ExcelJS.Workbook,
//     start: number,
//     end: number,
//     howMany: number,
// ): ExcelJS.Row[] {
//     const selectedRows: ExcelJS.Row[] = [];

//     wb.eachSheet((sheet) => {
//         let firstNonEmptyRowIndex = start;
//         for (let i = start; i < end; i++) {
//             const row = sheet.getRow(i);
//             if (row.cellCount > 0) {
//                 firstNonEmptyRowIndex = i;
//                 selectedRows.push(row);
//                 break;
//             }
//         }

//         const totalAvailableRows = end - firstNonEmptyRowIndex;
//         const interval = Math.floor(totalAvailableRows / howMany);

//         for (let i = 1; i < howMany; i++) {
//             const rowIndex = firstNonEmptyRowIndex + interval * i;
//             const row = sheet.getRow(rowIndex);
//             if (row.cellCount > 0) {
//                 selectedRows.push(row);
//             }
//         }
//     });

//     return selectedRows;
// }

// function getSheetDetails(wb: ExcelJS.Workbook): {
//     headerRow: Row | null;
//     headerRowNumber: number;
//     gapAt: number;
// } {
//     let headerRow: Row | null = null;
//     let headerRowNumber = -1;
//     let headerFound = false;

//     let gapAt = -1;
//     let foundGap = false;

//     let val = null;
//     let rightBehindVal: number | null = null;

//     wb.eachSheet((sheet) => {
//         sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
//             if (!headerFound) {
//                 headerRow = row.values;
//                 headerRowNumber = rowNumber;
//                 headerFound = true;
//             }

//             if (!foundGap) {
//                 val = rowNumber;

//                 if (val && rightBehindVal) {
//                     if (val - rightBehindVal !== 1) {
//                         gapAt = rightBehindVal + 1;
//                         foundGap = true;
//                     }
//                 }

//                 rightBehindVal = val;
//             }
//         });

//         if (gapAt === -1) {
//             gapAt = sheet.rowCount;
//         }

//         if (headerRowNumber === -1) {
//             headerRowNumber = 1;
//         }
//     });

//     return { headerRow, headerRowNumber, gapAt };
// }
