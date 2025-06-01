import mongoose, { Model } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongodb';
import Perfume from '../../../../models/Perfume';

// Helper function to validate ObjectId
function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/perfumes/[id] - Get a single perfume
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        let perfume;

        // Allow lookup by ID or a possible slug/name
        if (isValidObjectId(id)) {
            perfume = await (Perfume as Model<any>).findById(id);
        } else {
            // This assumes you might want to search by name too
            perfume = await (Perfume as Model<any>).findOne({
                name: { $regex: new RegExp(`^${id}$`, 'i') }
            });
        }

        if (!perfume) {
            return NextResponse.json(
                { error: 'Perfume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(perfume);
    } catch (error: any) {
        console.error('Error fetching perfume:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch perfume' },
            { status: 500 }
        );
    }
}

// PUT /api/perfumes/[id] - Update a perfume
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { error: 'Invalid perfume ID' },
                { status: 400 }
            );
        }

        const body = await req.json();

        const updatedPerfume = await (Perfume as Model<any>).findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedPerfume) {
            return NextResponse.json(
                { error: 'Perfume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedPerfume);
    } catch (error: any) {
        console.error('Error updating perfume:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update perfume' },
            { status: 400 }
        );
    }
}

// DELETE /api/perfumes/[id] - Delete a perfume
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { error: 'Invalid perfume ID' },
                { status: 400 }
            );
        }

        const deletedPerfume = await (Perfume as Model<any>).findByIdAndDelete(id);

        if (!deletedPerfume) {
            return NextResponse.json(
                { error: 'Perfume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Perfume deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting perfume:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete perfume' },
            { status: 500 }
        );
    }
}