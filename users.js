const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET user by ID
router.get('/:id', auth.authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error.');
    }
});

// UPDATE user details
router.put('/:id', auth.authenticateJWT, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'isPublicProfile'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!');
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error.');
    }
});

// UPDATE user role (Admin authorization required)
router.put('/:id/role', auth.authenticateJWT, auth.authorizeAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.role = req.body.role;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send('Server error.');
    }
});

module.exports = router;
