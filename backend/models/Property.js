const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Apartment', 'House', 'Land'],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  ownedBy: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  bedroom: {
    type: Number,
  },
  bathroom: {
    type: Number,
  },
  area: {
    type: Number, // in sq ft
  },
  status: {
    type: String,
    enum: ['sold', 'pending', 'available'],
    default: 'available',
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);