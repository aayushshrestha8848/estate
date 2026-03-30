const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  createBulkProperties,
  updateProperty,
  deleteProperty,
  clearAllProperties
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProperties)
  .post(protect, createProperty)
  .delete(protect, clearAllProperties);

router.route('/bulk')
  .post(protect, createBulkProperties);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;