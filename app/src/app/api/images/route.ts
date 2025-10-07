import { NextResponse } from "next/server";
import { Image } from "@/lib/models/Image";

export async function GET() {
  try {
    const images = await Image.findAll(100, 0);

    // Don't send image data in list view, only metadata
    const imageList = images.map((img) => ({
      id: img.id,
      filename: img.filename,
      originalFilename: img.original_filename,
      mimeType: img.mime_type,
      fileSize: img.file_size,
      latitude: img.latitude,
      longitude: img.longitude,
      categoryId: img.category_id,
      categoryNameEn: img.category_name_en,
      categoryNameSv: img.category_name_sv,
      description: img.description,
      uploadTimestamp: img.upload_timestamp,
    }));

    return NextResponse.json({
      images: imageList,
      total: imageList.length,
    });
  } catch (error) {
    console.error("Get images error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve images" },
      { status: 500 }
    );
  }
}
