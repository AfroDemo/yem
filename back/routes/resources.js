const express = require('express');
const { 
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getFeaturedResources,
  searchResources
} = require('../controllers/resourceController');
const { auth, mentorAuth } = require('../middleware/auth');

const router = express.Router();

// Create resource (mentors and admins only)
router.post('/', auth, mentorAuth, createResource);

// Get all resources
router.get('/', getAllResources);

// Get resource by ID
router.get('/:id', getResourceById);

// Update resource
router.put('/:id', auth, updateResource);

// Delete resource
router.delete('/:id', auth, deleteResource);

// Get featured resources
router.get('/featured', getFeaturedResources);

// Search resources
router.get('/search', searchResources);

module.exports = router;
