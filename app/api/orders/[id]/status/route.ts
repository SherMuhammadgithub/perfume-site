import mongoose, { Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db/mongodb";
import Order from "../../../../../models/Order";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Define consistent route params type
type RouteParams = { params: { id: string } };

// PUT /api/orders/[id]/status - Update order status
export async function PUT(req: NextRequest, context: RouteParams) {
  try {
    await dbConnect();

    const { id } = context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const { status } = await req.json();
    type OrderStatus =
      | "Processing"
      | "Confirmed"
      | "Shipped"
      | "Delivered"
      | "Cancelled";

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = [
      "Processing",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Find order to check current status
    const order = await (Order as Model<any>).findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Additional business logic for status transitions
    // For example, you can't move from Delivered back to Processing
    const statusOrder = {
      Processing: 0,
      Confirmed: 1,
      Shipped: 2,
      Delivered: 3,
      Cancelled: -1, // Special case
    };

    // Only allow moving to Cancelled from Processing or Confirmed
    if (
      status === "Cancelled" &&
      !["Processing", "Confirmed"].includes(order.status)
    ) {
      return NextResponse.json(
        {
          error:
            "Orders can only be cancelled when in Processing or Confirmed state",
        },
        { status: 400 }
      );
    }
    // For non-cancelled statuses, ensure we're not moving backwards
    if (status !== "Cancelled" && order.status !== "Cancelled") {
      const newStatus = status as OrderStatus;
      const currentStatus = order.status as OrderStatus;
      if (statusOrder[newStatus] < statusOrder[currentStatus]) {
        return NextResponse.json(
          {
            error: `Cannot change order status from ${order.status} to ${status}`,
          },
          { status: 400 }
        );
      }
    }

    // Update the order status
    const updatedOrder = await (Order as Model<any>).findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
