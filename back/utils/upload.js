const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage to save to temp-uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, "../temp-uploads");
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes =
    /doc|docx|xls|xlsx|csv|pdf|ppt|pptx|mp4|mov|avi|jpe?g|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    filetypes.test(file.mimetype) ||
    file.mimetype.includes("msword") ||
    file.mimetype.includes("vnd.ms-excel") ||
    file.mimetype.includes("vnd.ms-powerpoint");

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only documents, spreadsheets, PDFs, presentations, videos, and images (doc, xls, pdf, ppt, mp4, mov, avi, jpeg, png, gif) are allowed"
      ),
      false
    );
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
