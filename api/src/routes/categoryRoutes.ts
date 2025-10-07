import express, { Request, Response } from "express";
import { Category } from "../models/Category";

const router: express.Router = express.Router();

// Get all categories
router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();

    res.json({
      categories: categories.map((cat) => ({
        id: cat.id,
        nameEn: cat.name_en,
        nameSv: cat.name_sv,
        descriptionEn: cat.description_en,
        descriptionSv: cat.description_sv,
      })),
      total: categories.length,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
});

// Get specific category by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json({
      id: category.id,
      nameEn: category.name_en,
      nameSv: category.name_sv,
      descriptionEn: category.description_en,
      descriptionSv: category.description_sv,
    });
  } catch (error) {
    console.error("Get category error:", error);
    return res.status(500).json({ error: "Failed to retrieve category" });
  }
});

export default router;
