import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log(req.body);

    console.log(req);

    return NextResponse.json({
        output: "hallo",
    });
}
