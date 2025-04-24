import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's unique username
 *           minLength: 4
 *           maxLength: 20
 *         email:
 *           type: string
 *           format: email
 *           description: User's unique email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's hashed password
 *           minLength: 8
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user has admin privileges
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: 4,
    maxlength: 20,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
