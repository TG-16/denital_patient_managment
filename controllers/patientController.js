const patientModel = require('../models/patient');
const bcrypt = require('bcrypt');
const validator = require("../utils/validator");
const jwt = require('jsonwebtoken');
const appointmentModel = require("../models/appointment");
const doctorModel = require("../models/doctor");

const registerPatient = async (req, res) => {
  const { name, email, password } = req.body;

  try {
  
    let existingPatient;
    if(!email)
      existingPatient = await patientModel.findOne({ name });
    if(email)
      existingPatient = await patientModel.findOne({ email })
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new patientModel({
      name,
      email,
      password: hashedPassword,
    });

    await patient.save();

    res.status(201).json({ message: 'Patient registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const valid = validator.inputValidator(req);
    if(!valid)
    {
      return res.status(400).json({message: "input fields cant be impty"});
    }
    else
    {
      const patient = await patientModel.findOne({email});
      if(patient)
      {                 
        const passwordCheck = await bcrypt.compare(password, patient.password);
        if(passwordCheck)
        {
          patient = patient.toObject();
          delete patient.password;
          return res.status(201).json({patient});
        }
        return res.status(400).json({message: "Password doesnt match"});
      }
      return res.status(201).json({message: "User not found"});
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
}


const book = async (req,res) => {
  const {patient, doctor, appointmentDate, reson} = req.body;
  try {
    const valid = validator.bookingValidator(req);
    if(!valid)
      return res.status(400).json({message: "input fields can't be empty"});

    const doctorAvailability = await doctorModel.findOne({name: doctor});
    if(doctorAvailability.todaysAvailability >= 42)
      return res.status(400).json({message: "Doctor is not available today"});

    const appointment = new appointmentModel({
      patient,
      doctor,
      appointmentDate,
      notes: reson
    });

    await appointment.save();

    doctorAvailability.todaysAvailability += 1;
    await doctorAvailability.save();

    res.status(201).json({ message: 'Booked successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});l
  }
}

const cancel = async (req,res) => {
  const {patient, doctor, appointmentDate, notes} = req.body;
  try {
    const valid = validator.bookingValidator(req);
    if(!valid)
      return res.status(400).json({message: "input fields can't be empty"});
    const appointment = await appointmentModel.findOneAndDelete({
      patient,
      doctor,
      appointmentDate
    });

    if(!appointment)
      return res.status(404).json({message: "Appointment not found"});
    
    const doctorAvailability = await doctorModel.findOne({name: doctor});
    doctorAvailability.todaysAvailability -= 1;
    await doctorAvailability.save();
    res.status(200).json({ message: 'Canceled successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});
  }
}

const rating = async (req,res) => { 
  const {rating, doctor} = req.body;
  try {
    const valid = validator.ratingValidator(req);
    if(!valid)
      return res.status(400).json({message: "invalid input"});
    const ratedDoctor = await doctorModel.findOne({name: doctor});

    if(!ratedDoctor)
      return res.status(404).json({message: "Doctor not found"});
    ratedDoctor.ratings.push(rating);
    ratedDoctor.averageRating = (ratedDoctor.ratings.reduce((a,b) => a+b, 0) / ratedDoctor.ratings.length).toFixed(1);
    await ratedDoctor.save();

    res.status(200).json({ message: 'Rated successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});
  }
}

const getDoctors = async (req,res) => {
  try {
    const doctors = await doctorModel.find({});
    if(doctors.length === 0)
      return res.status(404).json({message: "No doctors found"});
    
    const sortedDoctors = doctors.map(doctor => {
        doctor = doctor.toObject(); // Convert Mongoose document to plain object
        delete doctor.password;
        delete doctor.ratings;
        return doctor;
    });

    sortedDoctors.sort((a,b) => b.averageRating - a.averageRating);
    res.status(200).json(sortedDoctors);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});
  }
}

const getHistory = async (req,res) => {
  const {patient} = req.body;
  try {
    const valid = validator.historyValidator(req);
    if(!valid)
      return res.status(400).json({message: "input fields can't be empty"});
    const history = await appointmentModel.find({patient});
    if(history.length === 0)
      return res.status(404).json({message: "No history found"});
    
    res.status(200).json(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});
  }
}

module.exports = {
  registerPatient,
  login,
  book,
  cancel,
  rating,
  getDoctors,
  getHistory,
};
