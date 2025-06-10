import express, { Request, Response } from "express";
import { Image } from "../models/Image";
import { HeatmapPoint, HeatmapBounds } from "../types";

const router: express.Router = express.Router();

// Get all coordinates for heatmap
router.get("/coordinates", async (req: Request, res: Response) => {
  try {
    const images = await Image.getAllWithCoordinates();

    const coordinates: HeatmapPoint[] = images.map((img) => ({
      lat: parseFloat(img.latitude!.toString()),
      lng: parseFloat(img.longitude!.toString()),
      count: 1, // Each image counts as 1 point
    }));

    res.json({
      points: coordinates,
      total: coordinates.length,
    });
  } catch (error) {
    console.error("Get coordinates error:", error);
    res.status(500).json({ error: "Failed to retrieve coordinates" });
  }
});

// Get coordinates within bounds
router.get("/bounds", async (req: Request, res: Response) => {
  try {
    const { north, south, east, west } = req.query;

    if (!north || !south || !east || !west) {
      res.status(400).json({
        error: "Missing bounds parameters. Required: north, south, east, west",
      });
      return;
    }

    const bounds: HeatmapBounds = {
      north: parseFloat(north as string),
      south: parseFloat(south as string),
      east: parseFloat(east as string),
      west: parseFloat(west as string),
    };

    const images = await Image.findByBounds(bounds);

    const coordinates = images.map((img) => ({
      id: img.id,
      lat: parseFloat(img.latitude!.toString()),
      lng: parseFloat(img.longitude!.toString()),
      filename: img.filename,
      uploadTimestamp: img.upload_timestamp,
    }));

    res.json({
      points: coordinates,
      bounds: bounds,
      total: coordinates.length,
    });
  } catch (error) {
    console.error("Get bounds coordinates error:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve coordinates for bounds" });
  }
});

// Get density data for heatmap (grouped by approximate grid)
router.get("/density", async (req: Request, res: Response) => {
  try {
    const precision = parseFloat(req.query.precision as string) || 0.01; // Grid precision in degrees

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

    res.json({
      points: densityPoints,
      precision: precision,
      total: densityPoints.length,
      totalImages: images.length,
    });
  } catch (error) {
    console.error("Get density error:", error);
    res.status(500).json({ error: "Failed to retrieve density data" });
  }
});

export default router;
