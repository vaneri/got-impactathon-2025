import { database } from './database';

let isInitialized = false;

export async function initializeDatabase() {
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

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  initializeDatabase().catch(console.error);
} 