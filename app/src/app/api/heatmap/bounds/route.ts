import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database';
import { Image } from '../../../../lib/models/Image';
import { HeatmapBounds } from '../../../../types/api';

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
    const north = searchParams.get('north');
    const south = searchParams.get('south');
    const east = searchParams.get('east');
    const west = searchParams.get('west');

    if (!north || !south || !east || !west) {
      return NextResponse.json({
        error: 'Missing bounds parameters. Required: north, south, east, west',
      }, { status: 400 });
    }

    const bounds: HeatmapBounds = {
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
    };

    const images = await Image.findByBounds(bounds);

    const coordinates = images.map((img) => ({
      id: img.id,
      lat: parseFloat(img.latitude!.toString()),
      lng: parseFloat(img.longitude!.toString()),
      filename: img.filename,
      uploadTimestamp: img.upload_timestamp,
    }));

    return NextResponse.json({
      points: coordinates,
      bounds: bounds,
      total: coordinates.length,
    });
  } catch (error) {
    console.error('Get bounds coordinates error:', error);
    return NextResponse.json({ error: 'Failed to retrieve coordinates for bounds' }, { status: 500 });
  }
} 