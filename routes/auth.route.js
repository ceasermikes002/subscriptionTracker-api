import { Router } from 'express';
import { signIn, signUp, signOut, createAdmin } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignUp:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     UserSignIn:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */

const authRouter = Router();

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUp'
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 *       400:
 *         description: Invalid input data
 */
authRouter.post('/sign-up', signUp);

/**
 * @swagger
 * /api/v1/auth/sign-in:
 *   post:
 *     summary: Authenticate existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignIn'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
authRouter.post('/sign-in', signIn);

// TEMPORARY: Admin creation endpoint - REMOVE IN PRODUCTION
authRouter.post('/create-admin', createAdmin);

/**
 * @swagger
 * /api/v1/auth/sign-out:
 *   post:
 *     summary: Sign out current user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully signed out
 *       401:
 *         description: Not authenticated
 */
authRouter.use(protect);
authRouter.post('/sign-out', signOut);

export default authRouter;
