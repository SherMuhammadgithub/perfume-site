
import mongoose from 'mongoose';

const PerfumeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a perfume name'],
        trim: true,
        index: true
    },
    brand: {
        type: String,
        required: [true, 'Please provide a brand name'],
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0
    },
    discountPrice: {
        type: Number,
        min: 0
    },
    volume: {
        type: String,
        required: [true, 'Please provide volume information']
    },
    stock: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Unisex'],
        required: true
    },
    images: [{
        url: String,
        alt: String,
    }],
    isNew: {
        type: Boolean,
        default: false
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    collections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    }]
}, {
    timestamps: true
});

// Create compound text index for search
PerfumeSchema.index({
    name: 'text',
    brand: 'text',
    description: 'text',
    category: 'text'
});

const Perfume = mongoose.models.Perfume || mongoose.model('Perfume', PerfumeSchema);

export default Perfume;