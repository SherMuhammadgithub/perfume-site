import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a collection name'],
        trim: true,
        unique: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    filters: {
        brands: [String],
        categories: [String],
        genders: [String],
        priceRange: {
            min: Number,
            max: Number
        }
    },
    // This can be used for dynamic collections like "New Arrivals", "Bestsellers" etc.
    isStatic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);

export default Collection;