import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dedent from "dedent";

export const POST = async (req: Request) => {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const type = formData.get("type") as "pdf" | "img";

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    try {
        const res = await getTables(file, type);

        return NextResponse.json({
            Message: "Success",
            status: 201,
            res: JSON.parse(res),
        });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};

async function getTables(file: File, type: "pdf" | "img"): Promise<string> {
    if (!process.env.GOOGLE_API_KEY) return "";

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const apiKey = process.env.GOOGLE_API_KEY;
    const baseUrl = "https://generativelanguage.googleapis.com";

    const uploadResponse = await uploadFile(file, apiKey, baseUrl);

    const prompt = dedent`
Use the ${type === "pdf" ? "document" : "image"} attached to transform this source data into the following target tables :

1. invoice Table Schema:
   {
     serialNumber: string,
     customerName: string,
     productName: string,
     qty: number,
     tax: number,
     totalAmount: number,
     date: string
   }

2. customer Table Schema:
   {
     name: string,
     phoneNumber: number,
     totalPurchaseAmount: number,
     email: string,
     lastPurchaseDate: string
   }

3. product Table Schema:
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
- Each mapping should follow this structure

Response must be a single JSON object with the following structure:
{
  "invoices": [
    {
      "serialNumber": "",
      "customerName": "",
      "productName": "",
      // ... other invoice fields
    },{
      "serialNumber": "",
      "customerName": "",
      "productName": "",
      // ... other invoice fields
    }
  ],
  "customers": [
    // customer objects
  ],
  "products": [
    // product objects
  ],
  "isTaxInPercentage": boolean
}

Output in JSON format.

Do not use markdown.

DO NOT INCLUDE BACKTICKS IN THE RESPONSE

JSON:
    `;

    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
        },
        { text: prompt },
    ]);

    return result.response.text();
}

const uploadFile = async (file: File, apiKey: string, baseUrl: string) => {
    const mimeType = file.type;
    const numBytes = file.size;
    const displayName = file.name;

    const startUploadResponse = await fetch(`${baseUrl}/upload/v1beta/files?key=${apiKey}`, {
        method: "POST",
        headers: {
            "X-Goog-Upload-Protocol": "resumable",
            "X-Goog-Upload-Command": "start",
            "X-Goog-Upload-Header-Content-Length": numBytes.toString(),
            "X-Goog-Upload-Header-Content-Type": mimeType,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            file: {
                display_name: displayName,
            },
        }),
    });

    if (!startUploadResponse.ok) {
        throw new Error(`Failed to start upload: ${await startUploadResponse.text()}`);
    }

    const uploadUrl = startUploadResponse.headers.get("X-Goog-Upload-URL");
    if (!uploadUrl) {
        throw new Error("Upload URL not found in response headers.");
    }

    const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            "Content-Length": numBytes.toString(),
            "X-Goog-Upload-Offset": "0",
            "X-Goog-Upload-Command": "upload, finalize",
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${await uploadResponse.text()}`);
    }

    const fileInfo = await uploadResponse.json();
    const uri = fileInfo.file.uri;

    return {
        file: {
            mimeType,
            uri,
            displayName,
        },
    };
};
