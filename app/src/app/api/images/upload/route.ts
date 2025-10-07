import { NextRequest, NextResponse } from "next/server";
import { Image } from "@/lib/models/Image";
import { Category } from "@/lib/models/Category";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    const coords = {
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    };

    // Use provided coordinates
    if (latitude && longitude) {
      coords.latitude = parseFloat(latitude);
      coords.longitude = parseFloat(longitude);
    }

    // Look up category ID if category name is provided
    let categoryId: number | undefined = undefined;
    if (category) {
      const categoryRecord = await Category.findByName(category);
      if (categoryRecord) {
        categoryId = categoryRecord.id;
      }
    }

    // Read file as buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;

    // Create and save image
    const image = new Image({
      filename: filename,
      originalFilename: file.name,
      mimeType: file.type,
      fileSize: file.size,
      imageData: new Uint8Array(buffer),
      latitude: coords.latitude,
      longitude: coords.longitude,
      categoryId: categoryId,
      description: description || undefined,
    });

    await image.save();

    // Get category names if category was set
    let categoryNameEn: string | undefined;
    let categoryNameSv: string | undefined;
    if (categoryId) {
      const cat = await Category.findById(categoryId);
      if (cat) {
        categoryNameEn = cat.name_en;
        categoryNameSv = cat.name_sv;
      }
    }

    const response = {
      id: image.id!,
      filename: image.filename,
      originalFilename: image.originalFilename,
      mimeType: image.mimeType,
      fileSize: image.fileSize,
      latitude: image.latitude,
      longitude: image.longitude,
      categoryId: image.categoryId,
      categoryNameEn: categoryNameEn,
      categoryNameSv: categoryNameSv,
      description: image.description,
      uploadTimestamp: image.uploadTimestamp!,
    };

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        image: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// Increase body size limit for image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
