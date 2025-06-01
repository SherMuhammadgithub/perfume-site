import { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongodb';
import Order from '../../../models/Order';
import Perfume from '../../../models/Perfume';

// GET /api/orders - Get all orders with filtering
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Parse query parameters
        const { searchParams } = new URL(req.url);

        // Build query
        const query: Record<string, any> = {};

        // Filter by order status
        const status = searchParams.get('status');
        if (status) {
            query.status = status;
        }

        // Filter by payment status
        const paymentStatus = searchParams.get('paymentStatus');
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        // Filter by customer email
        const email = searchParams.get('email');
        if (email) {
            query['customer.email'] = { $regex: new RegExp(email, 'i') };
        }

        // Filter by date range
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Search by order number
        const orderNumber = searchParams.get('orderNumber');
        if (orderNumber) {
            query.orderNumber = { $regex: orderNumber, $options: 'i' };
        }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Sort orders - newest first by default
        const sort: { [key: string]: 1 | -1 } = { createdAt: -1 };

        // Execute query with pagination
        const orders = await (Order as Model<any>)
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await (Order as Model<any>).countDocuments(query);

        return NextResponse.json({
            orders,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create a new order
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        // Generate order number manually
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        body.orderNumber = `ORD-${year}${month}${day}-${random}`;


        // Validate required fields
        const requiredFields = ['customer', 'shippingAddress', 'items', 'subtotal', 'total', 'paymentMethod'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Validate customer fields
        if (!body.customer.email || !body.customer.name) {
            return NextResponse.json(
                { error: 'Customer email and name are required' },
                { status: 400 }
            );
        }

        // Validate shipping address
        const requiredAddressFields = ['address', 'city', 'postalCode', 'country'];
        for (const field of requiredAddressFields) {
            if (!body.shippingAddress[field]) {
                return NextResponse.json(
                    { error: `Shipping address ${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Validate items
        if (!Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json(
                { error: 'Order must contain at least one item' },
                { status: 400 }
            );
        }

        // Verify perfumes exist and are in stock
        for (const item of body.items) {
            if (!item.perfume) {
                return NextResponse.json(
                    { error: 'Each item must reference a perfume ID' },
                    { status: 400 }
                );
            }

            const perfume = await (Perfume as Model<any>).findById(item.perfume);
            if (!perfume) {
                return NextResponse.json(
                    { error: `Perfume with ID ${item.perfume} not found` },
                    { status: 404 }
                );
            }

            if (perfume.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Not enough stock for ${perfume.name}. Available: ${perfume.stock}` },
                    { status: 400 }
                );
            }

            // Add perfume name and price if not provided
            if (!item.name) {
                item.name = perfume.name;
            }

            if (!item.price) {
                item.price = perfume.discountPrice || perfume.price;
            }
        }

        // Create the order
        const order = await (Order as Model<any>).create(body);

        // Update stock for each perfume (reduce quantity)
        for (const item of body.items) {
            await (Perfume as Model<any>).findByIdAndUpdate(
                item.perfume,
                { $inc: { stock: -item.quantity } }
            );
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 400 }
        );
    }
}