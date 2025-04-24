import jwt from 'jsonwebtoken';
import User from '../database/models/user.model.js';
import process from 'process';

export const protect = async (req, res, next) => {
    try {
        // 1. Get token from header
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            const error = new Error('Not authorized to access this route');
            error.statusCode = 401;
            throw error;
        }
        try {
            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // 3. Check if user still exists
            const currentUser = await User.findById(decoded.id).select('-password');
            if (!currentUser) {
                const error = new Error('The user belonging to this token no longer exists');
                error.statusCode = 401;
                throw error;
            }
            // 4. Add user to request object
            req.user = currentUser;
            next();
        } catch (err) {
            const error = new Error('Invalid token', err);
            error.statusCode = 401;
            throw error;
            
        }
    } catch (error) {
        next(error);
    }
};

// Optional: Check if user owns the resource
export const checkOwnership = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            const error = new Error('No document found with that ID');
            error.statusCode = 404;
            throw error;
        }
        if (doc.userId.toString() !== req.user._id.toString()) {
            const error = new Error('You do not have permission to perform this action');
            error.statusCode = 403;
            throw error;
        }
        req.doc = doc;
        next();
    } catch (error) {
        next(error);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            const error = new Error('Not authorized. Admin access required');
            error.statusCode = 403;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
};







































