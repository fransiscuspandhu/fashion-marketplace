import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const safeFilename = path.basename(decodeURIComponent(filename));
    const filepath = path.join(process.cwd(), "public", "uploads", safeFilename);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan" },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filepath);
    const ext = path.extname(safeFilename).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error serving uploaded image:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat file gambar" },
      { status: 500 }
    );
  }
}
