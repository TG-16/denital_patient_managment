const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: false
  },
  ratings: {
    type: Array,
    default: []
  },
  averageRating: {
    type: Number,
    default: 0
  },
  todaysAvailability: {
    type: Number,
    default: 0,
    max: 42
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: Index for search performance
// doctorSchema.index({ fullName: 1, specialization: 1 });

const doctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = doctorModel;
