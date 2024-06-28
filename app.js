const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/User');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const contentRoutes = require('./routes/content');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(express.static('public')); // Serving static files like CSS, JS, and images
app.use(express.json()); // Parsing JSON data sent to the server
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded data sent by HTML forms

const { authenticateJWT, authorizeAdmin } = require('./middleware/auth'); // Import auth middleware

// Use the user, project, and content routes
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/projects', authenticateJWT, projectRoutes);
app.use('/api/content', authenticateJWT, contentRoutes);

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if email is already used
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use.');
        }

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).send('All fields are required.');
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance and save it to the database
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();

        // Redirect to login page after successful signup
        res.redirect('/login.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with email:', email); // Log the email

        // Check if email and password are provided
        if (!email || !password) {
            console.log('Email or password not provided'); // Log missing fields
            return res.status(400).send('All fields are required.');
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid email'); // Log invalid email
            return res.status(400).send('Invalid email or password.');
        }

        // Compare the provided password with the stored hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Invalid password'); // Log invalid password
            return res.status(400).send('Invalid email or password.');
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        console.log('Generated token:', token); // Log the generated token

        // Send the token in the response
        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error); // Log the error
        res.status(500).send('Server error.');
    }
});

// Serve the dashboard based on user role
app.get('/dashboard', authenticateJWT, (req, res) => {
    console.log('User in request:', req.user); // Log the user object

    if (!req.user) {
        console.log('User not found in request'); // Log missing user
        return res.status(401).send('User not found');
    }

    if (req.user.role === 'employee') {
        res.sendFile(path.join(__dirname, 'public', 'employeeDashboard.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'userDashboard.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; // Ensure app is exported for use in middleware
