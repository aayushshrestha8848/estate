const express = require('express');
const router = express.Router();
const { getFavourites, addFavourite, removeFavourite, clearAllFavourites } = require('../controllers/favouriteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getFavourites)
  .delete(protect, clearAllFavourites);

router.route('/:propertyId')
  .post(protect, addFavourite)
  .delete(protect, removeFavourite);

module.exports = router;
