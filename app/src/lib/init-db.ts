import { database } from './database';

let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    await database.connect();
    isInitialized = true;
    console.log('🚀 Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

// Database will be initialized when API routes are called 