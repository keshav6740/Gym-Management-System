const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    membership: {
        plan: {
            type: String,
            enum: ['Basic', 'Premium', 'Platinum', null],
            default: null
        },
        startDate: {
            type: Date
        },
        paymentStatus: {
            type: String,
            default: 'Pending'
        }
    }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);