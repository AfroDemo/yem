const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const processProfileImage = async (filePath) => {
  try {
    const optimizedPath = filePath.replace(
      path.extname(filePath),
      "-optimized.jpg"
    );

    await sharp(filePath)
      .resize(500, 500, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toFile(optimizedPath);

    // Remove original file
    fs.unlinkSync(filePath);

    return optimizedPath;
  } catch (error) {
    throw new Error("Failed to process image");
  }
};

module.exports = { processProfileImage };
