const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  address: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const adminModel = mongoose.model('Admin', adminSchema);

module.exports = adminModel;