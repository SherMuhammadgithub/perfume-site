import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    perfume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perfume',
        required: true
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        // Don't require the field directly - we'll validate it differently
        unique: true,
        // Instead, use a custom validator that allows null/undefined values
        // for new documents only
        validate: {
            validator: function (this: mongoose.Document, v: unknown): boolean {
                // If this is a new document, allow null/undefined
                // Otherwise, require a value
                return this.isNew || (v !== null && v !== undefined);
            },
            message: 'Order number is required'
        }
    },
    customer: {
        email: {
            type: String,
            required: [true, 'Please provide customer email'],
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Please provide customer name'],
            trim: true
        },
        phone: String
    },
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    items: [OrderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    paymentDetails: {
        transactionId: String,
        provider: String,
        timestamp: Date
    },
    status: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    trackingNumber: String,
    notes: String,
    giftMessage: String,
    isGift: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate order number before validation
OrderSchema.pre('validate', function (next) {
    if (this.isNew && !this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD-${year}${month}${day}-${random}`;
    }
    next();
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;