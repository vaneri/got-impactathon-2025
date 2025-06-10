import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database';
import { Image } from '../../../../lib/models/Image';

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

    return NextResponse.json({
      id: image.id,
      filename: image.filename,
      originalFilename: image.original_filename,
      mimeType: image.mime_type,
      fileSize: image.file_size,
      latitude: image.latitude,
      longitude: image.longitude,
      uploadTimestamp: image.upload_timestamp,
    });
  } catch (error) {
    console.error('Get image error:', error);
    return NextResponse.json({ error: 'Failed to retrieve image' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureConnection();
    
    const { id } = await params;
    const imageId = parseInt(id);
    const result = await Image.delete(imageId);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
} 