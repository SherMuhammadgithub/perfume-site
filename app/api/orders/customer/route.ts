import { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongodb';
import Order from '../../../../models/Order';

// GET /api/orders/customer - Get orders for a specific customer
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Get customer email from query params
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Customer email is required' },
                { status: 400 }
            );
        }

        // Build query
        const query = { 'customer.email': email };

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Get orders
        const orders = await (Order as Model<any>)
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count
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
        console.error('Error fetching customer orders:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch customer orders' },
            { status: 500 }
        );
    }
}