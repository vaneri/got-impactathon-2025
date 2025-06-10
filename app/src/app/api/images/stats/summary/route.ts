import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    await ensureConnection();
    
    const stats = await Image.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Failed to retrieve statistics' }, { status: 500 });
  }
} 