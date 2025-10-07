import { database } from "../database";

export interface CategoryRow {
  id: number;
  name_en: string;
  name_sv: string;
  description_en: string | null;
  description_sv: string | null;
  created_at: string;
}

export class Category {
  public id?: number;
  public nameEn: string;
  public nameSv: string;
  public descriptionEn?: string;
  public descriptionSv?: string;
  public createdAt?: Date;

  constructor(data: {
    id?: number;
    nameEn: string;
    nameSv: string;
    descriptionEn?: string;
    descriptionSv?: string;
    createdAt?: Date;
  }) {
    this.id = data.id;
    this.nameEn = data.nameEn;
    this.nameSv = data.nameSv;
    this.descriptionEn = data.descriptionEn;
    this.descriptionSv = data.descriptionSv;
    this.createdAt = data.createdAt;
  }

  // Get all categories
  static async findAll(): Promise<CategoryRow[]> {
    const sql = `
      SELECT id, name_en, name_sv, description_en, description_sv, created_at
      FROM categories
      ORDER BY name_en ASC
    `;
    return await database.query<CategoryRow>(sql);
  }

  // Find category by ID
  static async findById(id: number): Promise<CategoryRow | null> {
    const idInt = parseInt(id.toString(), 10);
    if (isNaN(idInt)) {
      return null;
    }
    const sql = `SELECT * FROM categories WHERE id = ${idInt}`;
    const results = await database.query<CategoryRow>(sql);
    return results.length > 0 ? results[0] : null;
  }

  // Find category by either language name
  static async findByName(name: string): Promise<CategoryRow | null> {
    const sql = `SELECT * FROM categories WHERE name_en = ? OR name_sv = ?`;
    const results = await database.query<CategoryRow>(sql, [name, name]);
    return results.length > 0 ? results[0] : null;
  }
}
