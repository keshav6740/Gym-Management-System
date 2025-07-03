// In routes/public.js

const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// This route already exists - keep it.
router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.find().sort({ name: 1 });
        res.json(classes);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- ADD THESE NEW TIERED ROUTES ---

// @desc    Get classes available to Basic (and above) members
router.get('/classes/basic', async (req, res) => {
    try {
        const classes = await Class.find({ 
            difficulty: { $in: ['Beginner', 'All Levels'] } 
        }).sort({ name: 1 });
        res.json(classes);
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// @desc    Get classes available to Premium (and above) members
router.get('/classes/premium', async (req, res) => {
    try {
        const classes = await Class.find({ 
            difficulty: { $in: ['Beginner', 'All Levels', 'Intermediate'] } 
        }).sort({ name: 1 });
        res.json(classes);
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// @desc    Get ALL classes for Platinum members
router.get('/classes/platinum', async (req, res) => {
    try {
        const classes = await Class.find().sort({ name: 1 });
        res.json(classes);
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});


module.exports = router;