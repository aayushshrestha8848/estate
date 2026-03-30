const Property = require('../models/Property');
const Favourite = require('../models/Favourite');

const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.userId }).populate('propertyId');
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addFavourite = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const existingFavourite = await Favourite.findOne({ userId: req.userId, propertyId });
    if (existingFavourite) {
      return res.status(400).json({ message: 'Property already in favourites' });
    }

    const favourite = await Favourite.create({ userId: req.userId, propertyId });
    res.status(201).json({ message: 'Added to favourites', favourite });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Property ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFavourite = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const favourite = await Favourite.findOneAndDelete({ userId: req.userId, propertyId });
    
    if (!favourite) {
      return res.status(404).json({ message: 'Favourite not found' });
    }

    res.json({ message: 'Removed from favourites' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Property ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const clearAllFavourites = async (req, res) => {
  try {
    // Only clears the favourites of the current logged-in user
    await Favourite.deleteMany({ userId: req.userId });
    res.json({ message: 'All favourites removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFavourites, addFavourite, removeFavourite, clearAllFavourites };
