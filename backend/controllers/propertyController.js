const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const startIndex = (page - 1) * limit;

    const total = await Property.countDocuments();
    const properties = await Property.find({}).skip(startIndex).limit(limit);

    res.json({
      success: true,
      count: properties.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: properties
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Property ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { 
      title, description, location, price, type, imageUrl, 
      isFeatured, bedroom, bathroom, area, status, ownedBy 
    } = req.body;

    if (!title || !location || !price || !type) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const propertyInfo = {
      title, location, price, type, imageUrl, 
      description, isFeatured, bedroom, bathroom, area, status, ownedBy
    };

    if (req.user && req.user._id) {
       propertyInfo.ownedBy = req.user._id;
    }

    const property = await Property.create(propertyInfo);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Property ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create bulk properties
// @route   POST /api/properties/bulk
const createBulkProperties = async (req, res) => {
  try {
    const properties = req.body; // Expects an array of objects
    if (!Array.isArray(properties)) {
      return res.status(400).json({ message: 'Input must be an array of properties' });
    }

    const propertiesToInsert = properties.map((prop) => {
      const propertyInfo = { ...prop };
      if (req.user && req.user._id) {
        propertyInfo.ownedBy = req.user._id;
      }
      return propertyInfo;
    });

    const insertedProperties = await Property.insertMany(propertiesToInsert);
    res.status(201).json({
      success: true,
      count: insertedProperties.length,
      data: insertedProperties
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Property ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear all properties
// @route   DELETE /api/properties
const clearAllProperties = async (req, res) => {
  try {
    await Property.deleteMany({});
    res.json({ message: 'All properties removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  createBulkProperties,
  updateProperty,
  deleteProperty,
  clearAllProperties
};