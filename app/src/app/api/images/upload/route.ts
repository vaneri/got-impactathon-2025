import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database';
import { Image } from '../../../../lib/models/Image';
import { ImageResponse } from '../../../../types/api';

// Ensure database connection
let dbConnected = false;
async function ensureConnection() {
  if (!dbConnected) {
    await database.connect();
    dbConnected = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureConnection();
    
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const coords = {
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    };

    // Use provided coordinates
    if (latitude && longitude) {
      coords.latitude = parseFloat(latitude);
      coords.longitude = parseFloat(longitude);
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${imageFile.name}`;

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageData = new Uint8Array(arrayBuffer);

    // Create and save image
    const image = new Image({
      filename: filename,
      originalFilename: imageFile.name,
      mimeType: imageFile.type,
      fileSize: imageFile.size,
      imageData: imageData,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    await image.save();

    const response: ImageResponse = {
      id: image.id!,
      filename: image.filename,
      originalFilename: image.originalFilename,
      mimeType: image.mimeType,
      fileSize: image.fileSize,
      latitude: image.latitude,
      longitude: image.longitude,
      uploadTimestamp: image.uploadTimestamp!,
    };

    return NextResponse.json({
      message: 'Image uploaded successfully',
      image: response,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
} 