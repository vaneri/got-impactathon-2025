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

export async function GET(request: NextRequest) {
  try {
    await ensureConnection();
    
    const { searchParams } = new URL(request.url);
    const precision = parseFloat(searchParams.get('precision') || '0.01'); // Grid precision in degrees

    const images = await Image.getAllWithCoordinates();

    // Group coordinates by grid cells
    const grid: {
      [key: string]: {
        lat: number;
        lng: number;
        count: number;
        images: Array<{ id: number; filename: string }>;
      };
    } = {};

    images.forEach((img) => {
      const lat = parseFloat(img.latitude!.toString());
      const lng = parseFloat(img.longitude!.toString());

      // Round coordinates to grid precision
      const gridLat = Math.round(lat / precision) * precision;
      const gridLng = Math.round(lng / precision) * precision;
      const gridKey = `${gridLat},${gridLng}`;

      if (!grid[gridKey]) {
        grid[gridKey] = {
          lat: gridLat,
          lng: gridLng,
          count: 0,
          images: [],
        };
      }

      grid[gridKey].count++;
      grid[gridKey].images.push({
        id: img.id,
        filename: img.filename,
      });
    });

    const densityPoints = Object.values(grid).map((cell) => ({
      lat: cell.lat,
      lng: cell.lng,
      count: cell.count,
      intensity: Math.min(cell.count / 10, 1), // Normalize intensity (max 1.0)
    }));

    return NextResponse.json({
      points: densityPoints,
      precision: precision,
      total: densityPoints.length,
      totalImages: images.length,
    });
  } catch (error) {
    console.error('Get density error:', error);
    return NextResponse.json({ error: 'Failed to retrieve density data' }, { status: 500 });
  }
} 