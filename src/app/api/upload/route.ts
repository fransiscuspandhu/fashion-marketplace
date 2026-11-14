import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 1. Multipart Form Data (File Upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const originalName = file.name || "image.png";
      const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${Date.now()}-${cleanName}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
        size: file.size,
      });
    }

    // 2. JSON Body (Base64 Data URL, e.g. from AI generator or cropped avatar)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { dataUrl, filename: suggestedName } = body;

      if (!dataUrl || typeof dataUrl !== "string") {
        return NextResponse.json({ success: false, error: "dataUrl tidak valid" }, { status: 400 });
      }

      // Check format data:image/...;base64,...
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ success: false, error: "Format Base64 tidak didukung" }, { status: 400 });
      }

      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      const filename = `${Date.now()}-${(suggestedName || "image").replace(/[^a-zA-Z0-9.-]/g, "_")}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
        size: buffer.length,
      });
    }

    return NextResponse.json({ success: false, error: "Content-Type tidak didukung" }, { status: 400 });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message || "Gagal mengunggah file ke server" }, { status: 500 });
  }
}
