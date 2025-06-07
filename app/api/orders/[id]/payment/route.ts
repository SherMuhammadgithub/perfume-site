import mongoose, { Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db/mongodb";
import Order from "../../../../../models/Order";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// PUT /api/orders/[id]/payment - Update payment status
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const { paymentStatus, paymentDetails } = await request.json();

    if (!paymentStatus) {
      return NextResponse.json(
        { error: "Payment status is required" },
        { status: 400 }
      );
    }

    // Validate payment status
    const validPaymentStatuses = ["Pending", "Paid", "Failed", "Refunded"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        {
          error: `Payment status must be one of: ${validPaymentStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Update fields
    const updateData: Record<string, any> = { paymentStatus };

    // Add payment details if provided
    if (paymentDetails) {
      updateData.paymentDetails = {
        ...paymentDetails,
        timestamp: paymentDetails.timestamp || new Date(),
      };
    }

    // Update the payment status
    const updatedOrder = await (Order as Model<any>).findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If payment is successful and order is in "Processing" state,
    // automatically move to "Confirmed"
    if (paymentStatus === "Paid" && updatedOrder.status === "Processing") {
      updatedOrder.status = "Confirmed";
      await updatedOrder.save();
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update payment status" },
      { status: 500 }
    );
  }
}
