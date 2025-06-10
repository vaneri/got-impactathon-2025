# API Setup Guide

## Prerequisites

1. Make sure your API server is running:

   ```bash
   cd api
   pnpm install
   pnpm dev
   ```

   The API should be available at `http://localhost:3000`

2. Configure the frontend API URL (optional):
   - Create a `.env.local` file in the `app` directory
   - Add: `NEXT_PUBLIC_API_URL=http://localhost:3000`
   - The app will use `http://localhost:3000` by default if not specified

## API Endpoints Used

- `GET /health` - Health check
- `GET /api/images` - Get all images metadata
- `GET /api/images/:id/file` - Get image file data
- `POST /api/images/upload` - Upload new image with coordinates
- `GET /api/heatmap/coordinates` - Get coordinates for map

## Features

- ✅ Real-time image upload from camera
- ✅ Display uploaded images on map
- ✅ API health checking with fallback
- ✅ Error handling and user feedback
- ✅ Automatic map centering based on data

## Troubleshooting

If you see "Failed to load map data" error:

1. Ensure API server is running on port 3000
2. Check browser console for detailed error messages
3. Verify database connection in API server
4. Try the retry button to reconnect
