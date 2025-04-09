const receptionModel = require('../models/reception');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("../utils/validator");
const appointmentModel = require("../models/appointment");
const doctorModel = require("../models/doctor");

// Register a new reception
const registerReception = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the patient already exists
    let existingReception;
    if(!email)
      existingReception = await receptionModel.findOne({ name });
    if(email)
      existingReception = await receptionModel.findOne({ email });
    if (existingReception) {
      return res.status(400).json({ message: 'Reception already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new patient instance
    const reception = new receptionModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save the patient to the database
    await reception.save();

    res.status(201).json({ message: 'Reception registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const login = async (req, res) => {
  const {name, email, password} = req.body;
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
    const appointment = new appointmentModel({
      patient,
      doctor,
      appointmentDate,
      notes: reson
    });

    await appointment.save();

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

    console.log(appointments);

    if (!appointments || appointments.length === 0) 
      return res.status(404).json({ message: 'No appointments found for today' });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  registerReception,
  book,
  cancel,
  todaysAppointments,
  login
};