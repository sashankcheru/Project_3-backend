const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();
const connectDB = require('./config/db');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Root Route
app.get('/', (req, res) => {
    return res.json("Hello There! Server is running...");
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Signup successful', token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Code Execution Endpoint
app.post('/run', async (req, res) => {
    console.log(req.body);
    const { language = "cpp", code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: "Code is required" });
    }

    try {
        const filepath = await generateFile(language, code);
        const output = await executeCpp(filepath);
        return res.json({ filepath, output });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};
startServer();
