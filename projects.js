const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a new project
router.post('/create', auth.authenticateJWT, async (req, res) => {
    const { name, userId } = req.body;
    try {
        const newProject = new Project({ name, userId });
        await newProject.save();

        const user = await User.findById(userId);
        if (user) {
            user.projects.push(newProject._id);
            await user.save();
        }

        res.status(200).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
});

// Get projects for a user
router.get('/:userId', auth.authenticateJWT, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.params.userId });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

module.exports = router;
