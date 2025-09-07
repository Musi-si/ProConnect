import express from "express";
import { updateProfile } from "../controllers/user";
import upload from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

// single file upload with field name 'profilePicture'
router.put("/profile", authMiddleware, upload.single("profilePicture"), updateProfile);

export default router;
