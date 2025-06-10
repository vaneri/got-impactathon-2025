import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../lib/database';
import { Image } from '../../../lib/models/Image';

// Ensure database connection
let dbConnected = false;
async function ensureConnection() {
  if (!dbConnected) {
    await database.connect();
    dbConnected = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureConnection();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const images = await Image.findAll(limit, offset);

    // Don't send image data in list view, only metadata
    const imageList = images.map((img) => ({
      id: img.id,
      filename: img.filename,
      originalFilename: img.original_filename,
      mimeType: img.mime_type,
      fileSize: img.file_size,
      latitude: img.latitude,
      longitude: img.longitude,
      uploadTimestamp: img.upload_timestamp,
    }));

    return NextResponse.json({
      images: imageList,
      pagination: {
        limit,
        offset,
        count: imageList.length,
      },
    });
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json({ error: 'Failed to retrieve images' }, { status: 500 });
  }
} 