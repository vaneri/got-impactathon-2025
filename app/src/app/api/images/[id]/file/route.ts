import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../../lib/database';
import { Image } from '../../../../../lib/models/Image';

// Ensure database connection
let dbConnected = false;
async function ensureConnection() {
  if (!dbConnected) {
    await database.connect();
    dbConnected = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureConnection();
    
    const { id } = await params;
    const imageId = parseInt(id);
    const image = await Image.findById(imageId);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Return the image binary data with proper headers
    return new NextResponse(image.image_data, {
      headers: {
        'Content-Type': image.mime_type,
        'Content-Length': image.file_size.toString(),
        'Content-Disposition': `inline; filename="${image.original_filename}"`,
      },
    });
  } catch (error) {
    console.error('Get image file error:', error);
    return NextResponse.json({ error: 'Failed to retrieve image file' }, { status: 500 });
  }
} 