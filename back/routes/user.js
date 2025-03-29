const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser, uploadProfileImage } = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, adminAuth, getAllUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, adminAuth, deleteUser);
router.put('/:id/profile-image', auth, uploadProfileImage);

module.exports = router;
