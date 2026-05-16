// ─── Cloudinary Upload API ───
// Handles image uploads to Cloudinary

import { NextRequest, NextResponse } from "next/server";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dm2niml6l";
const API_KEY = process.env.CLOUDINARY_API_KEY || "255354961216669";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "nabila-lahore-uploads";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "nabila-gallery";
    const title = (formData.get("title") as string) || "";
    const category = (formData.get("category") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadData = new FormData();
    uploadData.append("file", dataUri);
    uploadData.append("upload_preset", UPLOAD_PRESET);
    uploadData.append("folder", folder);

    // Add context metadata if provided
    if (title) {
      uploadData.append("context", `alt=${title}|caption=${title}|category=${category}`);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cloudinary upload error:", response.status, errorData);
      return NextResponse.json(
        { error: "Upload failed", details: errorData },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
