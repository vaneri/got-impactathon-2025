import { NextResponse } from "next/server";
import { Category } from "@/lib/models/Category";

export async function GET() {
  try {
    const categories = await Category.findAll();

    return NextResponse.json({
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
    return NextResponse.json(
      { error: "Failed to retrieve categories" },
      { status: 500 }
    );
  }
}
