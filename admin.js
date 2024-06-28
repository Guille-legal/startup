const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeAdmin } = require('../middleware/auth');
const User = require('../models/User');

// Endpoint to get all users
router.get('/users', [authenticateJWT, authorizeAdmin], async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Endpoint to change user type
router.put('/users/:id', [authenticateJWT, authorizeAdmin], async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    user.userType = req.body.userType;
    await user.save();
    res.send(user);
});

module.exports = router;
