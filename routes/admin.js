const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Class = require('../models/Class');
const Trainer = require('../models/Trainer');

const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') next();
    else return res.status(403).json({ msg: 'Access denied. Admin authorization required.' });
};
const protect = [auth, adminAuth];

// --- DASHBOARD & STATS ---
router.get('/stats', protect, async (req, res) => {
    try {
        const [totalMembers, totalClasses, totalTrainers] = await Promise.all([
            User.countDocuments(),
            Class.countDocuments(),
            Trainer.countDocuments()
        ]);
        const activeMembers = await User.countDocuments({ 'membership.paymentStatus': 'Active' });
        const monthlyRevenue = activeMembers * 1500;
        res.json({ totalMembers, monthlyRevenue, totalClasses, totalTrainers });
    } catch (err) { res.status(500).json({ msg: 'Server Error', error: err.message }); }
});

// --- MEMBER MANAGEMENT ---
router.get('/members', protect, async (req, res) => {
    try {
        const data = await User.find().select('-password').sort({ joinDate: -1 });
        res.json(data);
    } catch (err) { res.status(500).json({ msg: 'Server Error', error: err.message }); }
});
router.post('/members', protect, async (req, res) => {
    try {
        if (!req.body.password) return res.status(400).json({ msg: 'Password is required for new members.' });
        const user = await new User(req.body).save();
        res.status(201).json(user);
    } catch (err) { res.status(400).json({ msg: 'Failed to create member.', error: err.message }); }
});
router.get('/members/:id', protect, async (req, res) => {
    try {
        const data = await User.findById(req.params.id).select('-password');
        res.json(data);
    } catch (err) { res.status(500).json({ msg: 'Server Error', error: err.message }); }
});
router.put('/members/:id', protect, async (req, res) => {
    try {
        const { password, ...otherFields } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Member not found' });

        Object.assign(user, otherFields);
        if (password) {
            user.password = password; // Let pre-save hook handle hashing
        }
        await user.save();
        res.json(user);
    } catch (err) { res.status(400).json({ msg: 'Failed to update member.', error: err.message }); }
});
router.delete('/members/:id', protect, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Member deleted' });
    } catch (err) { res.status(500).json({ msg: 'Server Error', error: err.message }); }
});

// --- CLASS MANAGEMENT ---
router.get('/classes', protect, (req, res) => Class.find().sort({ name: 1 }).then(d => res.json(d)).catch(e => res.status(500).json({msg: e.message})));
router.post('/classes', protect, (req, res) => new Class(req.body).save().then(d => res.status(201).json(d)).catch(e => res.status(400).json({msg: e.message})));
router.get('/classes/:id', protect, (req, res) => Class.findById(req.params.id).then(d=>res.json(d)).catch(e => res.status(500).json({msg:e.message})));
router.put('/classes/:id', protect, (req, res) => Class.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).then(d => res.json(d)).catch(e => res.status(400).json({msg: e.message})));
router.delete('/classes/:id', protect, (req, res) => Class.findByIdAndDelete(req.params.id).then(() => res.json({ msg: 'Class deleted' })).catch(e => res.status(500).json({msg: e.message})));

// --- TRAINER MANAGEMENT ---
router.get('/trainers', protect, (req, res) => Trainer.find().sort({ name: 1 }).then(d => res.json(d)).catch(e => res.status(500).json({msg: e.message})));
router.post('/trainers', protect, (req, res) => new Trainer(req.body).save().then(d => res.status(201).json(d)).catch(e => res.status(400).json({msg: e.message})));
router.get('/trainers/:id', protect, (req, res) => Trainer.findById(req.params.id).then(d=>res.json(d)).catch(e => res.status(500).json({msg:e.message})));
router.put('/trainers/:id', protect, (req, res) => Trainer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).then(d => res.json(d)).catch(e => res.status(400).json({msg: e.message})));
router.delete('/trainers/:id', protect, (req, res) => Trainer.findByIdAndDelete(req.params.id).then(() => res.json({ msg: 'Trainer deleted' })).catch(e => res.status(500).json({msg: e.message})));

module.exports = router;