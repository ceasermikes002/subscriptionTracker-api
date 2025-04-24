import mongoose from 'mongoose';
import User from '../database/models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import process from 'process';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        
        const { username, email, password } = req.body;
        
        // Check If user already exists
        const user = await User.findOne({ email });
        if (user) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{
            username,
            email,
            password: hashedPassword
        }], { session });

        const token = jwt.sign(
            { id: newUser[0]._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        await session.commitTransaction();

        res.status(201).json({
            message: "User created successfully",
            data: {
                token,
                user: newUser[0]
            },
            success: true
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(200).json({
            message: "User logged in successfully",
            data: {
                token,
                user
            },
            success: true
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        // Since we're using JWT, we'll let the client handle token removal
        // But we can send a successful response indicating the user is signed out
        res.status(200).json({
            success: true,
            message: "User signed out successfully"
        });
    } catch (error) {
        next(error);
    }
};

// TEMPORARY: Create admin user - TO BE REMOVED IN PRODUCTION
export const createAdmin = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin user
        const adminUser = await User.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: true  // Set as admin
        });

        // Remove password from response
        const userResponse = adminUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            data: userResponse
        });
    } catch (error) {
        next(error);
    }
};
