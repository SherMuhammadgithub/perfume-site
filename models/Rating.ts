import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
    perfume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perfume',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    reviewer: {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            trim: true,
            lowercase: true
        }
    },
    verifiedPurchase: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
}, {
    timestamps: true
});

// Index for faster lookups by perfume
RatingSchema.index({ perfume: 1 });

// Update perfume average rating when a new rating is added
RatingSchema.post('save', async function () {
    if (this.isApproved) {
        const Perfume = mongoose.model('Perfume');
        const avgRatingData = await (this as mongoose.Document & { model: Function }).model('Rating').aggregate([
            { $match: { perfume: this.perfume, isApproved: true } },
            {
                $group: {
                    _id: '$perfume',
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (avgRatingData.length > 0) {
            await Perfume.findByIdAndUpdate(this.perfume, {
                averageRating: Math.round(avgRatingData[0].averageRating * 10) / 10, // Round to 1 decimal place
                totalReviews: avgRatingData[0].count
            });
        }
    }
});

const Rating = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);

export default Rating;