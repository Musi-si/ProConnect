import express from "express";
import { updateProfile, getFreelancers } from "../controllers/user";
import upload from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User account management
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated user name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Updated user email
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/profile", authMiddleware, upload.single("profilePicture"), updateProfile);

/**
 * @swagger
 * /api/users/freelancers:
 *   get:
 *     summary: Get all freelancers
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of freelancers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Freelancer ID
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   avatar:
 *                     type: string
 *                     description: URL to freelancer's profile picture
 *                   rating:
 *                     type: number
 *                     description: Freelancer rating
 *                   reviewCount:
 *                     type: number
 *                     description: Number of reviews the freelancer has
 */
router.get("/freelancers", getFreelancers);

export default router;
