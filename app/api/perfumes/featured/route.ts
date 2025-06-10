import { Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db/mongodb";
import Perfume from "../../../../models/Perfume";

// GET /api/perfumes/featured - Get featured perfumes with their collections
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Parse query params for limit
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    // Fetch featured perfumes and populate their collections
    const featuredPerfumes = await (Perfume as Model<any>)
      .find({ isFeatured: true })
      .populate("collections") // Populate the collections field
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(featuredPerfumes);
  } catch (error: any) {
    console.error("Error fetching featured perfumes with collections:", error);
    return NextResponse.json(
      {
        error:
          error.message || "Failed to fetch featured perfumes with collections",
      },
      { status: 500 }
    );
  }
}
