const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Needed for password hashing
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   POST /api/user/membership
// @desc    Update user membership
// @access  Private
router.post('/membership', auth, async (req, res) => {
    const { plan } = req.body;

    const planMapping = {
        'Basic Membership': 'Basic',
        'Premium Membership': 'Premium',
        'Platinum Membership': 'Platinum'
    };
    const mappedPlan = planMapping[plan];
    
    if (!mappedPlan) {
        return res.status(400).json({ msg: 'Invalid membership plan' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.membership.plan = mappedPlan;
        user.membership.startDate = new Date();
        user.membership.paymentStatus = 'Active';

        await user.save();
        res.json({ success: true, user });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET /api/user/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Process booking dates for the activity heatmap
        const activityDates = user.bookings.map(b => {
            // Return date in YYYY-MM-DD format
            return b.bookingDate.toISOString().split('T')[0];
        });

        // Send back a combined object
        res.json({
            profile: user,
            activity: activityDates
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- NEW ROUTE FOR UPDATING PROFILE ---
// THIS IS THE NEW, MORE ROBUST CODE
// @route   PUT /api/user/profile
// @desc    Update user profile (name and/or password)
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { fullName, password } = req.body;

    try {
        // Find the user first to ensure they exist
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Create an object with the fields to update
        const updateFields = {};
        if (fullName) {
            updateFields.fullName = fullName;
        }
        
        // If a password is being updated, hash it and add to the fields
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        // Use findByIdAndUpdate to apply the changes directly.
        // This is cleaner and avoids triggering the pre-save hook unnecessarily for this specific operation.
        // The { new: true } option ensures the returned document is the updated one.
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password'); // Exclude password from the response

        res.json({
            success: true,
            msg: 'Profile updated successfully.',
            user: updatedUser
        });

    } catch (err) {
        console.error('PUT /profile error:', err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});

// --- NEW ROUTE FOR DELETING PROFILE ---
// @route   DELETE /api/user/profile
// @desc    Delete user profile
// @access  Private
router.delete('/profile', auth, async (req, res) => {
    try {
        // FIXED: Use findByIdAndDelete which is the current Mongoose function
        const user = await User.findByIdAndDelete(req.user.id);
        
        if (!user) {
            // This is a valid case if the user was already deleted, send a JSON response
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Send a JSON success response
        res.json({ success: true, msg: 'Your account has been permanently deleted.' });

    } catch (err) {
        console.error('DELETE /profile error:', err.message);
        // FIXED: Always send a JSON object for errors
        res.status(500).json({ success: false, msg: 'Server Error. Could not delete account.' });
    }
});

// @route   POST /api/user/bookings
// @desc    Book a class for the logged-in user
// @access  Private
router.post('/bookings', auth, async (req, res) => {
    const { classId, className, classSchedule } = req.body;
    if (!classId || !className || !classSchedule) {
        return res.status(400).json({ msg: 'Missing class information.' });
    }
    
    try {
        const user = await User.findById(req.user.id);
        
        // Check if already booked
        if (user.bookings.some(booking => booking.classId.toString() === classId)) {
            return res.status(400).json({ msg: 'You have already booked this class.' });
        }

        user.bookings.push({ classId, className, classSchedule });
        await user.save();
        res.status(201).json(user.bookings);

    } catch (err) {
        console.error('Booking error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/user/bookings
// @desc    Get all bookings for the logged-in user
// @access  Private
router.get('/bookings', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookings.classId');
        res.json(user.bookings);
    } catch (err) {
        console.error('Get bookings error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE /api/user/bookings/:bookingId
// @desc    Cancel a class booking for the logged-in user
// @access  Private
router.delete('/bookings/:bookingId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        // Find the index of the booking to remove
        const removeIndex = user.bookings.findIndex(
            booking => booking._id.toString() === req.params.bookingId
        );

        if (removeIndex === -1) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        // Remove the booking from the array
        user.bookings.splice(removeIndex, 1);

        await user.save();
        
        // Return the updated list of bookings
        res.json(user.bookings);

    } catch (err) {
        console.error('Cancel booking error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});


module.exports = router;