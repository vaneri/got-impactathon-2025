import { NextResponse } from 'next/server';
import { database } from '../../../../lib/database';
import { Image } from '../../../../lib/models/Image';
import { HeatmapPoint } from '../../../../types/api';

// Ensure database connection
let dbConnected = false;
async function ensureConnection(): Promise<void> {
  if (!dbConnected) {
    await database.connect();
    dbConnected = true;
  }
}

export async function GET() {
  try {
    await ensureConnection();
    
    const images = await Image.getAllWithCoordinates();

    const coordinates: HeatmapPoint[] = images.map((img) => ({
      lat: parseFloat(img.latitude!.toString()),
      lng: parseFloat(img.longitude!.toString()),
      count: 1, // Each image counts as 1 point
    }));

    return NextResponse.json({
      points: coordinates,
      total: coordinates.length,
    });
  } catch (error) {
    console.error('Get coordinates error:', error);
    return NextResponse.json({ error: 'Failed to retrieve coordinates' }, { status: 500 });
  }
} 