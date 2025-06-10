import { database } from '../config/database';
import { ImageRow, ImageStats, HeatmapBounds } from '../types';

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
        const sql = `
            INSERT INTO images (filename, original_filename, mime_type, file_size, image_data, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            this.filename,
            this.originalFilename,
            this.mimeType,
            this.fileSize,
            this.imageData,
            this.latitude || null,
            this.longitude || null
        ];
        
        const result = await database.query(sql, params);
        this.id = result.insertId;
        return this;
    }

    // Find image by ID
    static async findById(id: number): Promise<ImageRow | null> {
        const sql = `SELECT * FROM images WHERE id = ?`;
        const results = await database.query(sql, [id]);
        return results.length > 0 ? results[0] : null;
    }

    // Find images by geographic bounds (for heatmap)
    static async findByBounds(bounds: HeatmapBounds): Promise<ImageRow[]> {
        const { north, south, east, west } = bounds;
        
        const sql = `
            SELECT id, filename, original_filename, latitude, longitude, upload_timestamp
            FROM images
            WHERE latitude BETWEEN ? AND ?
              AND longitude BETWEEN ? AND ?
              AND latitude IS NOT NULL
              AND longitude IS NOT NULL
            ORDER BY upload_timestamp DESC
        `;
        
        return await database.query(sql, [south, north, west, east]);
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
    static async findAll(limit: number = 100, offset: number = 0): Promise<ImageRow[]> {
        const sql = `
            SELECT * FROM images
            ORDER BY upload_timestamp DESC
            LIMIT ? OFFSET ?
        `;
        
        return await database.query(sql, [limit, offset]);
    }

    // Delete image
    static async delete(id: number): Promise<any> {
        const sql = `DELETE FROM images WHERE id = ?`;
        return await database.query(sql, [id]);
    }

    // Get basic statistics
    static async getStats(): Promise<ImageStats> {
        const statsQueries = [
            `SELECT COUNT(*) as total_images FROM images`,
            `SELECT COUNT(*) as images_with_coordinates FROM images WHERE latitude IS NOT NULL AND longitude IS NOT NULL`,
            `SELECT AVG(file_size) as avg_file_size FROM images`
        ];
        
        const results = await Promise.all(
            statsQueries.map(query => database.query(query))
        );
        
        return {
            totalImages: results[0][0].total_images,
            imagesWithCoordinates: results[1][0].images_with_coordinates,
            avgFileSize: Math.round(results[2][0].avg_file_size || 0)
        };
    }
} 