const path = require("path");
const fs = require("fs").promises;

exports.uploadFile = async (file) => {
  try {
    const fileName = `resource-${Date.now()}${path.extname(file.originalname)}`;
    const finalPath = path.join(__dirname, "../../public/uploads", fileName);
    const finalDir = path.dirname(finalPath);

    // Ensure the uploads directory exists
    await fs.mkdir(finalDir, { recursive: true });

    // Move file from temp-uploads to public/uploads
    await fs.rename(file.path, finalPath);

    // Generate public URL (assuming public/uploads is served statically)
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to process file upload");
  }
};