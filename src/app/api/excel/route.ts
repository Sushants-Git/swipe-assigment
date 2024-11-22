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
    const { headerRow, randomRows }: { headerRow: Row | null; randomRows: Row[] } = await req.json();

    try {
        try {
            // const mapping = await getMappingFromAI(headerRow, randomRows);
            const mapping = {
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
