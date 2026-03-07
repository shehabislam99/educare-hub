import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const image = formData.get("image");

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const imgbbApiKey = process.env.NEXT_IMGBB_API_KEY;
        if (!imgbbApiKey) {
            return NextResponse.json({ error: "ImgBB API key not configured" }, { status: 500 });
        }

        const imgbbFormData = new FormData();
        imgbbFormData.append("image", image);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: imgbbFormData,
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({ url: data.data.url });
        } else {
            return NextResponse.json({ error: data.error?.message || "Upload failed" }, { status: 500 });
        }
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
