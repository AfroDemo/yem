const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage to save directly to final uploads location
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/uploads");
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if needed
    cb(null, uploadDir); // Save directly to uploads (no temp)
  },
  filename: function (req, file, cb) {
    // Verify we have the user ID
    if (!req.params.id) {
      return cb(new Error("User ID is required for file upload"));
    }
    cb(null, `profile-${req.params.id}-${Date.now()}.webp`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, png, gif) are allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
