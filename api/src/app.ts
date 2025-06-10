import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import { database } from "./config/database";
import imageRoutes from "./routes/imageRoutes";
import heatmapRoutes from "./routes/heatmapRoutes";

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static files (for serving uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/images", imageRoutes);
app.use("/api/heatmap", heatmapRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Simple Geotag Image API Server (TypeScript)",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      images: "/api/images",
      heatmap: "/api/heatmap",
    },
  });
});

// Start server
async function startServer(): Promise<void> {
  try {
    await database.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
