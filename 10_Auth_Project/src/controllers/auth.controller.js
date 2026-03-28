const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config.js');
const sessionModel = require('../models/session.model');

// Email Service
const { sendEmail } = require('../services/email.service.js')

const { generateOtp, getOtpHtml } = require('../utils/otp.util.js')
// OTP Model
const otpModel = require('../models/otp.model.js');

async function registerUser(req, res) {
    try {
        // Get All Data from Body
        const { fullName, username, email, password, role = 'user' } = req.body;
        const normalizedUsername = String(username || '').toLowerCase().trim();
        const normalizedEmail = String(email || '').toLowerCase().trim();

        // Check if any Data field is missing or not
        if (!fullName || !password || !normalizedUsername || !normalizedEmail) {
            return res.status(400).json({
                message: 'fullName, username, email, and password are required'
            });
        }

        // Check password length must be > 8
        if (String(password).length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Check if User Already Exists
        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({ message: 'User already exists with same email or username' });
        }

        // Hash the password before store in database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new User
        const user = await userModel.create({
            fullName,
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
            role
        });

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        const html = getOtpHtml(otp);

        // Keep only the latest OTP for this email/user.
        await otpModel.deleteMany({ email: normalizedEmail });

        await otpModel.create({
            email: normalizedEmail,
            user: user._id,
            otpHash
        })

        await sendEmail({
            to: normalizedEmail,
            subject: "OTP Verification",
            text: `Your OTP for account verification is: ${otp}`,
            html
        })

        // User Created
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                verified: user.verified
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({ message: 'Provide username or email, and password' });
        }

        const normalizedUsername = username ? String(username).toLowerCase().trim() : undefined;
        const normalizedEmail = email ? String(email).toLowerCase().trim() : undefined;

        // password is select:false in schema, so explicitly include it here.
        const user = await userModel
            .findOne({
                $or: [{ normalizedUsername }, { normalizedEmail }]
            })
            .select('+password');

        // If User not Exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: "Account not verified. Please check your email for OTP verification." })
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect Password !' });
        }

        /// Generate new Refresh token for security
        const newRefreshToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

        // create a new session
        const session = await sessionModel.create({
            user: user._id,
            refreshToken: newRefreshTokenHash,
            ip: req.ip || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown'
        });

        // Generate new Access Token 
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                sessionId: session._id
            },
            config.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Store new Refresh token in secure cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // SUCCESS: Return 200 OK with safe user data
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function logoutUser(req, res) {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(400).json({ message: 'Refresh token not found' });
        }

        // Find active session without hashing (bcrypt.hash() creates different hash each time)
        const session = await sessionModel.findOne({
            revoke: false
        })

        if (!session) {
            return res.status(400).json({
                message: "No active session found"
            })
        }

        // Use bcrypt.compare to verify the incoming token against stored hash
        const isTokenValid = await bcrypt.compare(incomingRefreshToken, session.refreshToken);

        if (!isTokenValid) {
            return res.status(400).json({
                message: "Invalid refresh token"
            })
        }
        session.revoke = true;
        await session.save();

        res.clearCookie('refreshToken');

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function logoutAll(req, res) {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) { return res.status(400).json({ message: "Refresh token not found" }) }

    const decoded = jwt.verify(incomingRefreshToken, config.JWT_SECRET);

    await sessionModel.updateMany({
        user: decoded.id,
        revoke: false
    }, {
        revoke: true
    })

    res.clearCookie("refreshToken")

    return res.status(200).json({
        message: "Logout from all devices successfully"
    })
}

async function getMe(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User fetched successfully',
            user: {
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

async function refreshToken(req, res) {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;
        if (!incomingRefreshToken) {
            return res.status(401).json({ message: 'Refresh Token not Found !!, Please login again' });
        }

        // decode the incoming refresh token and verify the token
        const decoded = jwt.verify(incomingRefreshToken, config.JWT_SECRET);

        // find the session using the refresh token
        const session = await sessionModel.findOne({
            user: decoded.id,
            revoke: false
        });

        // if session not exists
        if (!session) {
            return res.status(401).json({ message: 'Invalid Session !!, Please login again' });
        }

        // Verify the token against stored hash using bcrypt.compare
        const isTokenValid = await bcrypt.compare(incomingRefreshToken, session.refreshToken);

        if (!isTokenValid) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new Access Token
        const accessToken = jwt.sign(
            {
                id: decoded.id,
                role: decoded.role,
                sessionId: session._id
            },
            config.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate new Refresh Token
        const newRefreshToken = jwt.sign(
            {
                id: decoded.id,
                role: decoded.role
            },
            config.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Hash the New Refresh Token Generated 
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

        // Update Session
        session.refreshToken = newRefreshTokenHash;
        await session.save();

        // Set New Refresh token in Cookies
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ message: 'Access token refreshed successfully', accessToken });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
}

async function verifyEmail(req, res) {
    const { email, otp } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!normalizedEmail || !otp) {
        return res.status(400).json({ message: 'email and otp are required' });
    }

    const otpDoc = await otpModel.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

    if (!otpDoc) {
        return res.status(400).json({ message: "OTP not found or expired" })
    }

    const isOtpValid = await bcrypt.compare(String(otp), otpDoc.otpHash);

    if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid OTP" })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user, { verified: true }, { new: true });

    await otpModel.deleteMany({ user: otpDoc.user });

    await sendEmail({
        to: normalizedEmail,
        subject: "Email Verified Successfully",
        text: "Congratulations! Your email has been verified successfully. You can now log in to your account and enjoy our services.",
        html: `<p>Congratulations! Your email has been verified successfully. You can now log in to your account and enjoy our services.</p>`
    })
    
    return res.status(200).json({
        message: "Email verified successfully",
        user: {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    });
}

module.exports = { registerUser, loginUser, logoutUser, logoutAll, getMe, refreshToken, verifyEmail };
