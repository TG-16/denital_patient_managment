const mongoose = require('mongoose');

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,  //diagnostics
    default: ''
  },
  prescription: {
    type: String,  
    default: ''
  },
  case: {
    type: String,  // Medical case detail
    default: 'other'
  },
  rating: {
    type: Number,  // Rating given by the patient after the appointment
    min: 1,
    max: 5,
    default: null
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Create an index for faster search by patient and doctor
//just under considertion i might remove it later
// appointmentSchema.index({ patient: 1, doctor: 1, appointmentDate: 1 });

const appointmentModel = mongoose.model('Appointment', appointmentSchema);
module.exports = appointmentModel;
