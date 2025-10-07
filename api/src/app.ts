// IMPORTANT: Load .env BEFORE any other imports that might use env variables
import dotenv from "dotenv";
const envPath = "/home/vaneri/got-impactathon-2025/.env";
dotenv.config({ path: envPath });

console.log("📂 Loading .env from:", envPath);
console.log(
  "🔍 POSTGRES_URL:",
  process.env.POSTGRES_URL ? "✓ Found" : "✗ Not found"
);

import express from "express";
import cors from "cors";
import * as path from "path";

import { database } from "./config/database";
import imageRoutes from "./routes/imageRoutes";
import heatmapRoutes from "./routes/heatmapRoutes";
import categoryRoutes from "./routes/categoryRoutes";

const app: express.Application = express();
const PORT = process.env.PORT || 3001; // Default to 3001 to avoid conflict with Next.js

// Basic middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (define BEFORE other routes)
app.get("/health", (req, res) => {
  console.log("✅ Health check hit");
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/images", imageRoutes);
app.use("/api/heatmap", heatmapRoutes);
app.use("/api/categories", categoryRoutes);

// Static files (for serving uploaded images) - after routes
try {
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
} catch (error) {
  console.warn("Warning: Could not set up uploads directory:", error);
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Gothenburg CityReport API",
    version: "1.0.0",
    description:
      "Fault reporting for streets, squares and parks - Official public document system for Gothenburg Municipality",
    status: "operational",
    municipality: "Gothenburg",
    emergency_contact: "031-365 00 00",
    endpoints: {
      health: "/health",
      images: "/api/images",
      heatmap: "/api/heatmap",
      categories: "/api/categories",
    },
    documentation: {
      swagger: "/api/docs",
      support: "support@cityreport.io",
    },
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "An unexpected error occurred",
    });
  }
);

// Start server
async function startServer(): Promise<void> {
  try {
    await database.connect();

    app.listen(PORT, () => {
      console.log(`╔══════════════════════════════════════════════════════╗`);
      console.log(`║  Gothenburg CityReport API - Fault Reporting        ║`);
      console.log(`╠══════════════════════════════════════════════════════╣`);
      console.log(`║  Status:        OPERATIONAL                          ║`);
      console.log(
        `║  Port:          ${PORT}                                     ║`
      );
      console.log(
        `║  Environment:   ${
          process.env.NODE_ENV || "development"
        }                      ║`
      );
      console.log(
        `║  Health Check:  http://localhost:${PORT}/health         ║`
      );
      console.log(`╚══════════════════════════════════════════════════════╝`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
