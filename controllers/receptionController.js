const receptionModel = require('../models/reception');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("../utils/validator");
const appointmentModel = require("../models/appointment");
const doctorModel = require("../models/doctor");

const registerReception = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    let existingReception;
    if(!email)
      existingReception = await receptionModel.findOne({ name });
    if(email)
      existingReception = await receptionModel.findOne({ email });
    if (existingReception) {
      return res.status(400).json({ message: 'Reception already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const reception = new receptionModel({
      name,
      email,
      password: hashedPassword,
    });

    await reception.save();

    res.status(201).json({ message: 'Reception registered successfully!' });
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
      const reception = await receptionModel.findOne({email});
      if(reception)
      {
        const passwordCheck = await bcrypt.compare(password, reception.password);
        if(passwordCheck)
        {
          return res.status(201).json({message: `welcome ${reception.name}`});
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

const todaysAppointments = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const appointments = await appointmentModel.find({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!appointments || appointments.length === 0) 
      return res.status(404).json({ message: 'No appointments found for today' });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

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

module.exports = {
  registerReception,
  book,
  cancel,
  todaysAppointments,
  login,
  getDoctors
};