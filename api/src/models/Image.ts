import { database } from "../config/database";
import { ImageRow, ImageStats, HeatmapBounds } from "../types";

interface ImageData {
  id?: number;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  imageData: Uint8Array;
  latitude?: number;
  longitude?: number;
  uploadTimestamp?: Date;
}

export class Image {
  public id?: number;
  public filename: string;
  public originalFilename: string;
  public mimeType: string;
  public fileSize: number;
  public imageData: Uint8Array;
  public latitude?: number;
  public longitude?: number;
  public uploadTimestamp?: Date;

  constructor(data: ImageData) {
    this.id = data.id;
    this.filename = data.filename;
    this.originalFilename = data.originalFilename;
    this.mimeType = data.mimeType;
    this.fileSize = data.fileSize;
    this.imageData = data.imageData;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.uploadTimestamp = data.uploadTimestamp;
  }

  // Save image to database
  async save(): Promise<Image> {
    // Validate numeric parameters
    const fileSize = parseInt(this.fileSize.toString(), 10);
    if (isNaN(fileSize)) {
      throw new Error("Invalid file size");
    }

    let latValue = 'NULL';
    let lngValue = 'NULL';
    
    if (this.latitude != null) {
      const lat = parseFloat(this.latitude.toString());
      if (!isNaN(lat)) {
        latValue = lat.toString();
      }
    }
    
    if (this.longitude != null) {
      const lng = parseFloat(this.longitude.toString());
      if (!isNaN(lng)) {
        lngValue = lng.toString();
      }
    }

    const sql = `
            INSERT INTO images (filename, original_filename, mime_type, file_size, image_data, latitude, longitude)
            VALUES (?, ?, ?, ${fileSize}, ?, ${latValue}, ${lngValue})
        `;

    const params = [
      this.filename,
      this.originalFilename,
      this.mimeType,
      this.imageData,
    ];

    const result = await database.query(sql, params);
    this.id = result.insertId;
    return this;
  }

  // Find image by ID
  static async findById(id: number): Promise<ImageRow | null> {
    const idInt = parseInt(id.toString(), 10);
    if (isNaN(idInt)) {
      return null;
    }
    const sql = `SELECT * FROM images WHERE id = ${idInt}`;
    const results = await database.query(sql);
    return results.length > 0 ? results[0] : null;
  }

  // Find images by geographic bounds (for heatmap)
  static async findByBounds(bounds: HeatmapBounds): Promise<ImageRow[]> {
    const { north, south, east, west } = bounds;

    // Validate and sanitize numeric bounds
    const southNum = parseFloat(south.toString());
    const northNum = parseFloat(north.toString());
    const westNum = parseFloat(west.toString());
    const eastNum = parseFloat(east.toString());

    if (isNaN(southNum) || isNaN(northNum) || isNaN(westNum) || isNaN(eastNum)) {
      throw new Error("Invalid bounds parameters");
    }

    const sql = `
            SELECT id, filename, original_filename, latitude, longitude, upload_timestamp
            FROM images
            WHERE latitude BETWEEN ${southNum} AND ${northNum}
              AND longitude BETWEEN ${westNum} AND ${eastNum}
              AND latitude IS NOT NULL
              AND longitude IS NOT NULL
            ORDER BY upload_timestamp DESC
        `;

    return await database.query(sql);
  }

  // Get all images with coordinates (for heatmap)
  static async getAllWithCoordinates(): Promise<ImageRow[]> {
    const sql = `
            SELECT id, filename, latitude, longitude, upload_timestamp
            FROM images
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            ORDER BY upload_timestamp DESC
        `;

    return await database.query(sql);
  }

  // Get all images
  static async findAll(
    limit: number = 100,
    offset: number = 0
  ): Promise<ImageRow[]> {
    // Ensure parameters are integers
    const limitInt = parseInt(limit.toString(), 10);
    const offsetInt = parseInt(offset.toString(), 10);
    
    const sql = `
            SELECT * FROM images
            ORDER BY upload_timestamp DESC
            LIMIT ${limitInt} OFFSET ${offsetInt}
        `;
    console.log(
      `Executing SQL: ${sql} with limit ${limitInt} and offset ${offsetInt}`
    );
    return await database.query(sql);
  }

  // Delete image
  static async delete(id: number): Promise<any> {
    const idInt = parseInt(id.toString(), 10);
    if (isNaN(idInt)) {
      throw new Error("Invalid ID parameter");
    }
    const sql = `DELETE FROM images WHERE id = ${idInt}`;
    return await database.query(sql);
  }

  // Get basic statistics
  static async getStats(): Promise<ImageStats> {
    const statsQueries = [
      `SELECT COUNT(*) as total_images FROM images`,
      `SELECT COUNT(*) as images_with_coordinates FROM images WHERE latitude IS NOT NULL AND longitude IS NOT NULL`,
      `SELECT AVG(file_size) as avg_file_size FROM images`,
    ];

    const results = await Promise.all(
      statsQueries.map((query) => database.query(query))
    );

    return {
      totalImages: results[0][0].total_images,
      imagesWithCoordinates: results[1][0].images_with_coordinates,
      avgFileSize: Math.round(results[2][0].avg_file_size || 0),
    };
  }
}
