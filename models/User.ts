import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    isEmailVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password cannot be less than 6 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'admin' // change it laster
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);