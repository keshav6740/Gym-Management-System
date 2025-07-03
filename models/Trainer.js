const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String }
});

module.exports = mongoose.model('Trainer', TrainerSchema);