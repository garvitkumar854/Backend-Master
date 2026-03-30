const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');

/**
 * - User Registration Controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const isExists = await userModel.findOne({ email: email });

    if (isExists) {
        return res.status(409).json({ message: 'User already exists with this email' });
    }

    const user = await userModel.create({
        name: name,
        email: email,
        password: password
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token);


    res.status(201).json({
        message: 'User registered successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    });

    // Send registration email
    await emailService.sendRegistrationEmail(user.email, user.name);
}

/**
 * - User Login Controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email }).select("+password");

    if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token);

    return res.status(200).json({
        message: 'User logged in successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    });
}

module.exports = { userRegisterController, userLoginController };