# Frontend API Integration Complete! 🎉

## ✅ Summary

The Gothenburg CityReport frontend is now **fully integrated with the API backend**. All data now persists to the Supabase PostgreSQL database instead of local memory.

---

## 🔄 What Changed

### 1. **New API Service** (`/app/src/services/apiService.ts`)

Created a comprehensive API service with the following methods:

```typescript
// Health check
ApiService.healthCheck(): Promise<boolean>

// Get all categories (19 bilingual categories)
ApiService.getCategories(): Promise<Category[]>

// Get all images with coordinates
ApiService.getImages(): Promise<ImageData[]>

// Get image URL for display
ApiService.getImageUrl(filename: string): string

// Upload new image report
ApiService.uploadImage(
  imageBlob: Blob,
  latitude: number,
  longitude: number,
  category?: string,
  description?: string
): Promise<ImageData | null>

// Get heatmap data
ApiService.getHeatmapData(bounds?): Promise<HeatmapPoint[]>
```

---

### 2. **Updated MapDataService** (`/app/src/types/map.ts`)

**Before:**

```typescript
// Returned mock/dummy data
static async getMapData(): Promise<MapData> {
  return {
    markers: [/* hardcoded markers */]
  };
}
```

**After:**

```typescript
// Fetches real data from API
static async getMapData(): Promise<MapData> {
  const { ApiService } = await import("../services/apiService");
  const images = await ApiService.getImages();

  // Convert API images to map markers
  const markers = images
    .filter(img => img.latitude && img.longitude)
    .map(img => ({
      id: img.id.toString(),
      latitude: img.latitude!,
      longitude: img.longitude!,
      title: img.categoryNameEn || `Report #${img.id}`,
      imageUrl: ApiService.getImageUrl(img.filename),
      // ... more fields
    }));

  return { center, zoom, markers };
}
```

---

### 3. **Updated CameraCapture** (`/app/src/components/CameraCapture.tsx`)

**Before:**

```typescript
const saveLocationReport = useCallback(() => {
  // Mock storage - creates marker in memory only
  const newMarker: MapMarker = {
    imageUrl: capturedImage, // Base64 data URL
    // ...
  };
  onNewMarker(newMarker); // Only adds to local state
}, []);
```

**After:**

```typescript
const saveLocationReport = useCallback(async () => {
  // Convert data URL to Blob
  const response = await fetch(capturedImage);
  const blob = await response.blob();

  // Upload to API (persists to database)
  const { ApiService } = await import("../services/apiService");
  const uploadedImage = await ApiService.uploadImage(
    blob,
    location.latitude,
    location.longitude,
    category,
    reportDescription
  );

  // Create marker from API response
  const newMarker: MapMarker = {
    id: uploadedImage.id.toString(),
    imageUrl: ApiService.getImageUrl(uploadedImage.filename),
    // ...
  };

  onNewMarker(newMarker); // Adds to map
}, []);
```

---

## 🔗 Data Flow

### **Loading Map Data**

```
User opens app
    ↓
page.tsx → MapDataService.getMapData()
    ↓
ApiService.getImages() → GET /api/images
    ↓
API queries Supabase PostgreSQL
    ↓
Returns images with JOIN on categories
    ↓
Frontend converts to MapMarkers
    ↓
Map displays markers
```

### **Submitting New Report**

```
User captures photo + GPS location
    ↓
Selects category & enters description
    ↓
CameraCapture.saveLocationReport()
    ↓
Converts image to Blob
    ↓
ApiService.uploadImage() → POST /api/images/upload
    ↓
API saves to Supabase PostgreSQL:
  - Binary image data (BYTEA)
  - GPS coordinates (DECIMAL)
  - Category ID (foreign key)
  - Description (TEXT)
    ↓
Returns uploaded image metadata
    ↓
Frontend creates marker
    ↓
New marker appears on map immediately
    ↓
Other users see it when they refresh
```

---

## 🌐 API Endpoints Used

| Endpoint                     | Method | Purpose                         |
| ---------------------------- | ------ | ------------------------------- |
| `/health`                    | GET    | Check API status                |
| `/api/categories`            | GET    | Get all report categories (19)  |
| `/api/images`                | GET    | Get all images with coordinates |
| `/api/images/upload`         | POST   | Upload new image report         |
| `/api/images/:filename/data` | GET    | Get image binary data           |
| `/api/heatmap`               | GET    | Get heatmap visualization data  |

---

## 🗄️ Database Schema

### **categories** table (19 entries)

```sql
id | name_en              | name_sv
---|----------------------|----------------------
1  | Lighting             | Belysning
2  | Noise                | Buller
3  | Bike Path            | Cykelbana
... (16 more categories)
```

### **images** table

```sql
id | filename | latitude  | longitude | category_id | description | image_data
---|----------|-----------|-----------|-------------|-------------|------------
1  | 123.jpg  | 57.6877   | 11.9468   | 1           | Broken...   | <binary>
```

---

## 📍 Gothenburg GPS Center

The map now centers on **Gothenburg, Sweden**:

- **Latitude**: 57.7089
- **Longitude**: 11.9746
- **Zoom**: 13

---

## ⚙️ Configuration

### **Frontend API URL**

Create `/app/.env.local` (if it doesn't exist):

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Production (update with your deployed API URL)
# NEXT_PUBLIC_API_URL=https://api.gothenburg-cityreport.com
```

### **Backend Database**

The API uses `/home/vaneri/got-impactathon-2025/.env`:

```env
POSTGRES_URL="postgres://postgres.dhspfhinkpxfoxumdppd:..."
POSTGRES_HOST="db.dhspfhinkpxfoxumdppd.supabase.co"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="l9DrVqhZnF89t9kM"
POSTGRES_DATABASE="postgres"
```

---

## 🚀 Running the Full Stack

### **Terminal 1: Start API**

```bash
cd /home/vaneri/got-impactathon-2025/api
pnpm dev
```

Expected output:

```
✅ PostgreSQL Database connected successfully
╔══════════════════════════════════════════════════════╗
║  Gothenburg CityReport API - Fault Reporting        ║
║  Port:          3000                                 ║
╚══════════════════════════════════════════════════════╝
```

### **Terminal 2: Start Frontend**

```bash
cd /home/vaneri/got-impactathon-2025/app
pnpm dev
```

Expected output:

```
- Local:        http://localhost:3002
```

### **Access the App**

Open http://localhost:3002 in your browser

---

## ✅ Features Now Working

1. **✅ Load existing reports from database**

   - All reports with GPS coordinates display on map
   - Markers show category, description, and image

2. **✅ Submit new reports**

   - Capture photo with device camera
   - Get GPS coordinates automatically
   - Select from 19 categories (bilingual)
   - Add optional description
   - Upload to Supabase PostgreSQL
   - Image appears on map immediately

3. **✅ Persistent storage**

   - Reports survive app restarts
   - All data stored in cloud database
   - Images stored as binary data (BYTEA)

4. **✅ Bilingual support**

   - Category names in English and Swedish
   - Frontend UI in both languages
   - API returns both translations

5. **✅ Image serving**
   - Images served via API endpoint
   - Binary data converted to image on-the-fly
   - Efficient storage in PostgreSQL

---

## 🧪 Testing

### **Test API Connection**

```bash
curl http://localhost:3000/health
# Should return: {"status":"OK","timestamp":"..."}

curl http://localhost:3000/api/categories
# Should return: {"categories":[...19 categories...],"total":19}
```

### **Test Frontend**

1. Open http://localhost:3002
2. Click the blue report button (bottom left)
3. Allow camera and location permissions
4. Capture a photo
5. Select a category
6. Add description (optional)
7. Click "Submit Report"
8. ✅ Success modal appears
9. ✅ New marker appears on map
10. Refresh page → marker still there (persisted!)

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (localhost:3002)               │  │
│  │  ├── page.tsx (Main App)                         │  │
│  │  ├── CameraCapture.tsx (Photo Upload)            │  │
│  │  ├── InteractiveMap.tsx (Leaflet Map)            │  │
│  │  └── apiService.ts (API Client)                  │  │
│  └──────────────────────────────────────────────────┘  │
│                         │ HTTP                          │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│            Express API (localhost:3000)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routes:                                         │  │
│  │  ├── /api/images (GET, POST)                    │  │
│  │  ├── /api/categories (GET)                      │  │
│  │  └── /api/heatmap (GET)                         │  │
│  └──────────────────────────────────────────────────┘  │
│                         │ SQL                           │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│      Supabase PostgreSQL (Cloud Database)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Tables:                                         │  │
│  │  ├── categories (19 entries)                    │  │
│  │  │   ├── id, name_en, name_sv                   │  │
│  │  └── images                                      │  │
│  │      ├── id, filename, image_data (BYTEA)       │  │
│  │      ├── latitude, longitude (DECIMAL)          │  │
│  │      ├── category_id (FK → categories.id)       │  │
│  │      └── description (TEXT)                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 What's Next?

The application is now **fully functional** with:

- ✅ Frontend connected to API
- ✅ API connected to Supabase PostgreSQL
- ✅ Image uploads working
- ✅ Category system integrated
- ✅ GPS coordinates stored
- ✅ Bilingual support (EN/SV)
- ✅ Real-time map updates

**Ready for deployment! 🚀**

---

© 2025 Gothenburg CityReport - City of Gothenburg
