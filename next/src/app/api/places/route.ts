import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log(request.url);
    const url = new URL(request.url);
    const text = url.searchParams.get("text");
    const response = await fetch(`http://nestjs:3000/places?text=${text}`, {
        next: {
            revalidate: 3600,
        },
    });
    return NextResponse.json(await response.json());
}
