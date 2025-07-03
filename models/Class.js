const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    trainer: { type: String, required: true }, // For simplicity, using String. Could be a ref to a Trainer model.
    schedule: { type: String, required: true }, // e.g., "Mon, Wed, Fri at 6:00 PM"
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], required: true },
    maxSize: { type: Number, default: 15 }
});

module.exports = mongoose.model('Class', ClassSchema);