const Resource = require('../models/Resource');
const User = require('../models/User');

// Create resource
exports.createResource = async (req, res) => {
  try {
    const { title, description, type, content, tags, category, fileUrl } = req.body;
    const authorId = req.user?.id;

    // Check if user exists
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new resource
    const newResource = new Resource({
      title,
      description,
      type,
      content,
      tags: tags || [],
      category,
      fileUrl,
      authorId,
      publishDate: new Date()
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const { type, category, tag } = req.query;
    
    // Build query based on filters
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    const resources = await Resource.find(query)
      .populate('authorId', 'firstName lastName profileImage')
      .sort({ publishDate: -1 });
    
    res.json(resources);
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('authorId', 'firstName lastName profileImage bio');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const { title, description, content, tags, category, fileUrl } = req.body;

    // Find resource
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is authorized to update this resource
    if (resource.authorId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    // Update fields
    if (title) resource.title = title;
    if (description) resource.description = description;
    if (content) resource.content = content;
    if (tags) resource.tags = tags;
    if (category) resource.category = category;
    if (fileUrl) resource.fileUrl = fileUrl;
    
    resource.lastUpdated = new Date();

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    // Find resource
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is authorized to delete this resource
    if (resource.authorId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await resource.remove();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured resources
exports.getFeaturedResources = async (req, res) => {
  try {
    // Get a mix of recent and popular resources
    const resources = await Resource.find()
      .populate('authorId', 'firstName lastName profileImage')
      .sort({ publishDate: -1 })
      .limit(6);
    
    res.json(resources);
  } catch (error) {
    console.error('Get featured resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search resources
exports.searchResources = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search in title, description, and content
    const resources = await Resource.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
      .populate('authorId', 'firstName lastName profileImage')
      .sort({ publishDate: -1 });
    
    res.json(resources);
  } catch (error) {
    console.error('Search resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
