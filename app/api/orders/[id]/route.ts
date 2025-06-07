import mongoose, { Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db/mongodb";
import Order from "../../../../models/Order";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

type RouteParams = { params: { id: string } };

// GET /api/orders/[id] - Get a single order
export async function GET(req: NextRequest, context: RouteParams) {
  try {
    await dbConnect();

    const { id } = context.params;

    let order;

    // Check if it's a valid ObjectId or an order number
    if (isValidObjectId(id)) {
      order = await (Order as Model<any>).findById(id);
    } else {
      // Try to find by order number
      order = await (Order as Model<any>).findOne({ orderNumber: id });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(req: NextRequest, context: RouteParams) {
  try {
    await dbConnect();

    const { id } = context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();

    // Don't allow updating the order number
    if (body.orderNumber) {
      delete body.orderNumber;
    }

    const updatedOrder = await (Order as Model<any>).findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 400 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order (restricted operation)
export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    await dbConnect();

    const { id } = context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    // Find the order first to check if it can be deleted
    const order = await (Order as Model<any>).findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow deletion for orders with status: Processing or Cancelled
    if (!["Processing", "Cancelled"].includes(order.status)) {
      return NextResponse.json(
        { error: "Cannot delete an order that has been confirmed or shipped" },
        { status: 403 }
      );
    }

    // Delete the order
    await (Order as Model<any>).findByIdAndDelete(id);

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
