import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import { database } from "./config/database";
import imageRoutes from "./routes/imageRoutes";
import heatmapRoutes from "./routes/heatmapRoutes";
import categoryRoutes from "./routes/categoryRoutes";

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
app.use("/api/categories", categoryRoutes);

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
    },
    documentation: {
      swagger: "/api/docs",
      support: "support@cityreport.io",
    },
    timestamp: new Date().toISOString(),
  });
});

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
