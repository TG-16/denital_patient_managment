const mongoose = require('mongoose');

const receptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: false
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: Index for fast lookup
// receptionSchema.index({ fullName: 1, shift: 1 });

const Reception = mongoose.model('Reception', receptionSchema);

module.exports = Reception;
