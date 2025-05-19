const { Op } = require("sequelize");
const { uploadFile } = require("../utils/fileUpload");
const Resource = require("../models").Resource;
const User = require("../models").User;

// Create resource
exports.createResource = async (req, res) => {
  try {
    // Handle multer file filter errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError.message });
    }

    const {
      createdById,
      title,
      description,
      type,
      category,
      tags,
      isDraft,
      isFeatured,
      fileUrl,
      sharedWithIds,
    } = req.body;
    let finalFileUrl = fileUrl;

    // Handle file upload if present
    if (req.file) {
      finalFileUrl = await uploadFile(req.file);
    }

    // Validate required fields
    if (!createdById || !title || !type) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: createdById, title, and type are required",
        });
    }

    // Create resource
    const resource = await Resource.create({
      createdById,
      title,
      description: description || null,
      type,
      category: category || null,
      fileUrl: finalFileUrl || null,
      tags: tags ? JSON.parse(tags) : [],
      isDraft: isDraft === "true" || isDraft === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    // Handle sharing with mentees
    if (sharedWithIds) {
      const userIds = JSON.parse(sharedWithIds);
      if (Array.isArray(userIds) && userIds.length > 0) {
        const shares = userIds.map((userId) => ({
          resourceId: resource.id,
          userId,
        }));
        await ResourceShare.bulkCreate(shares);
      }
    }

    res.status(201).json(resource);
  } catch (error) {
    console.error("Create resource error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { type, category, tag, mentorId } = req.query;
    const where = { createdById: mentorId || req.user.id };

    if (type) where.type = type;
    if (category) where.category = category;
    if (tag) where.tags = { [Op.contains]: [tag] };

    const resources = await Resource.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
        {
          model: User,
          as: "sharedWith",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["publishDate", "DESC"]],
    });

    res.json(resources);
  } catch (error) {
    console.error("Get all resources error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
        {
          model: User,
          as: "sharedWith",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.createdById !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(resource);
  } catch (error) {
    console.error("Get resource by ID error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      tags,
      category,
      fileUrl,
      isDraft,
      isFeatured,
      sharedWithIds,
    } = req.body;

    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.createdById !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this resource" });
    }

    await resource.update({
      title: title || resource.title,
      description: description || resource.description,
      content: content || resource.content,
      tags: tags || resource.tags,
      category: category || resource.category,
      fileUrl: fileUrl || resource.fileUrl,
      isDraft: isDraft !== undefined ? isDraft : resource.isDraft,
      isFeatured: isFeatured !== undefined ? isFeatured : resource.isFeatured,
      updatedAt: new Date(),
    });

    if (sharedWithIds && Array.isArray(sharedWithIds)) {
      await resource.setSharedWith(sharedWithIds);
    }

    const updatedResource = await Resource.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
        {
          model: User,
          as: "sharedWith",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    res.json(updatedResource);
  } catch (error) {
    console.error("Update resource error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.createdById !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this resource" });
    }

    await resource.destroy();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get featured resources
exports.getFeaturedResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      where: { isFeatured: true, createdById: req.user.id },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
        {
          model: User,
          as: "sharedWith",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["publishDate", "DESC"]],
      limit: 6,
    });

    res.json(resources);
  } catch (error) {
    console.error("Get featured resources error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search resources
exports.searchResources = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const resources = await Resource.findAll({
      where: {
        createdById: req.user.id,
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } },
          { tags: { [Op.contains]: [query] } },
        ],
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
        {
          model: User,
          as: "sharedWith",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["publishDate", "DESC"]],
    });

    res.json(resources);
  } catch (error) {
    console.error("Search resources error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
