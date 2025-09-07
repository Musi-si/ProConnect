import { Request, Response } from "express";
import { User } from "../models/user"; // adjust path if needed

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // From auth middleware

    const {
      firstName,
      lastName,
      bio,
      location,
      skills,
      portfolioLinks,
      profilePicture,
      hourlyRate,
    } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (skills !== undefined) user.skills = skills;
    if (portfolioLinks !== undefined) user.portfolioLinks = portfolioLinks;
    if (profilePicture !== undefined) (user as any).profilePicture = profilePicture;
    if (hourlyRate !== undefined) (user as any).hourlyRate = hourlyRate;

    await user.save();

    res.json({ user });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
