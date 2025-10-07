import { NextRequest, NextResponse } from "next/server";
import { Image } from "@/lib/models/Image";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    // Find image by filename
    const sql = `SELECT image_data, mime_type FROM images WHERE filename = ?`;
    const { database } = await import("@/lib/database");
    const results = await database.query(sql, [filename]);

    if (results.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const image = results[0];

    // Return image as binary data
    return new NextResponse(image.image_data, {
      headers: {
        "Content-Type": image.mime_type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Get image data error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve image data" },
      { status: 500 }
    );
  }
}
