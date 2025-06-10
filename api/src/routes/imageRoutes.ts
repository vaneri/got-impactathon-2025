import express, { Request, Response } from "express";
import multer from "multer";
import { Image } from "../models/Image";
import { ImageResponse } from "../types";

const router: express.Router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    }
  },
});

// Upload image with coordinates
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const { latitude, longitude } = req.body;
    let coords = {
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    };

    // Use provided coordinates
    if (latitude && longitude) {
      coords.latitude = parseFloat(latitude);
      coords.longitude = parseFloat(longitude);
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${req.file.originalname}`;

    // Create and save image
    const image = new Image({
      filename: filename,
      originalFilename: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      imageData: req.file.buffer,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    await image.save();

    const response: ImageResponse = {
      id: image.id!,
      filename: image.filename,
      originalFilename: image.originalFilename,
      mimeType: image.mimeType,
      fileSize: image.fileSize,
      latitude: image.latitude,
      longitude: image.longitude,
      uploadTimestamp: image.uploadTimestamp!,
    };

    res.status(201).json({
      message: "Image uploaded successfully",
      image: response,
    });
    return;
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
    return;
  }
});

// Get all images
router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const images = await Image.findAll(limit, offset);

    // Don't send image data in list view, only metadata
    const imageList = images.map((img) => ({
      id: img.id,
      filename: img.filename,
      originalFilename: img.original_filename,
      mimeType: img.mime_type,
      fileSize: img.file_size,
      latitude: img.latitude,
      longitude: img.longitude,
      uploadTimestamp: img.upload_timestamp,
    }));

    res.json({
      images: imageList,
      pagination: {
        limit,
        offset,
        count: imageList.length,
      },
    });
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({ error: "Failed to retrieve images" });
  }
});

// Get statistics
router.get("/stats/summary", async (req: Request, res: Response) => {
  try {
    const stats = await Image.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to retrieve statistics" });
  }
});

// Get image file data
router.get("/:id/file", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set({
      "Content-Type": image.mime_type,
      "Content-Length": image.file_size.toString(),
      "Content-Disposition": `inline; filename="${image.original_filename}"`,
    });

    res.send(image.image_data);
  } catch (error) {
    console.error("Get image file error:", error);
    res.status(500).json({ error: "Failed to retrieve image file" });
  }
});

// Get specific image by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    return res.json({
      id: image.id,
      filename: image.filename,
      originalFilename: image.original_filename,
      mimeType: image.mime_type,
      fileSize: image.file_size,
      latitude: image.latitude,
      longitude: image.longitude,
      uploadTimestamp: image.upload_timestamp,
    });
  } catch (error) {
    console.error("Get image error:", error);
    return res.status(500).json({ error: "Failed to retrieve image" });
  }
});

// Delete image
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Image.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    return res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;
