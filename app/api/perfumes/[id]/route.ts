import dbConnect from "lib/db/mongodb";
import Perfume from "models/Perfume";
import { isValidObjectId, Model } from "mongoose";
import { NextResponse } from "next/server";

// GET /api/perfumes/[id] - Get a single perfume
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Access id directly without destructuring first
    const id = (await params).id;

    let perfume;

    // Allow lookup by ID or a possible slug/name
    if (isValidObjectId(id)) {
      perfume = await (Perfume as Model<any>)
        .findById(id)
        .populate("collections");
    } else {
      perfume = await (Perfume as Model<any>)
        .findOne({
          name: { $regex: new RegExp(`^${id}$`, "i") },
        })
        .populate("collections");
    }

    if (!perfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    // Optional: Fetch related perfumes
    const relatedPerfumes = await (Perfume as Model<any>)
      .find({
        _id: { $ne: perfume._id },
        brand: perfume.brand,
      })
      .limit(4)
      .select("_id name brand price discountPrice images");

    return NextResponse.json({
      perfume,
      relatedPerfumes,
    });
  } catch (error: any) {
    console.error("Error fetching perfume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch perfume" },
      { status: 500 }
    );
  }
}

// PUT /api/perfumes/[id] - Update a perfume
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Access id directly
    const id = (await params).id;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid perfume ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedPerfume = await (Perfume as Model<any>).findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedPerfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPerfume);
  } catch (error: any) {
    console.error("Error updating perfume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update perfume" },
      { status: 400 }
    );
  }
}

// DELETE /api/perfumes/[id] - Delete a perfume
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Access id directly
    const id = (await params).id;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid perfume ID" },
        { status: 400 }
      );
    }

    const deletedPerfume = await (Perfume as Model<any>).findByIdAndDelete(id);

    if (!deletedPerfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Perfume deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting perfume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete perfume" },
      { status: 500 }
    );
  }
}
