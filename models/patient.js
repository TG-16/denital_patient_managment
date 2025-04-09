const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false
  },
  dateOfBirth: {
    type: Date,
    required: false
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
  medicalHistory: [
    {
      diagnosis: String,
      prescription: String,
      caseType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CaseType'
      },
      treatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const patientModel = mongoose.model('Patient', patientSchema);

module.exports = patientModel;