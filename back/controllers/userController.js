const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      skills,
      interests,
      location,
      socialLinks,
    } = req.body;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is authorized to update this profile
    if (req.user?.id !== req.params.id && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    if (location) user.location = location;
    if (socialLinks) user.socialLinks = socialLinks;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      location: updatedUser.location,
      socialLinks: updatedUser.socialLinks,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is a mentor, delete their mentor profile
    if (user.role === "mentor") {
      await MentorProfile.findOneAndDelete({ userId: user._id });
    }

    // Delete user
    await user.remove();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    // In a real application, you would:
    // 1. Handle file upload using multer or similar
    // 2. Store the file in a cloud storage service
    // 3. Update the user's profileImage field with the URL

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is authorized to update this profile
    if (req.user?.id !== req.params.id && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    // For this demo, we'll just update with a placeholder URL
    user.profileImage = req.body.imageUrl || "https://via.placeholder.com/150";
    await user.save();

    res.json({
      message: "Profile image updated successfully",
      imageUrl: user.profileImage,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
