const doctorModel = require('../models/doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("../utils/validator");
const patientModel = require("../models/patient");
const appointmentModel = require('../models/appointment');

// Register a new doctor
const registerDoctor = async (req, res) => {
  const { name, email, password, specialization } = req.body;

  try {
    // Check if the patient already exists
    let existingDoctor;
    if(!email)
      existingDoctor = await doctorModel.findOne({ name });
    if(email)
      existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new patient instance
    const doctor = new doctorModel({
      name,
      email,
      specialization,
      password: hashedPassword,
    });

    // Save the patient to the database
    await doctor.save();

    res.status(201).json({ message: 'Doctor registered successfully!' });
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
      const doctor = await doctorModel.findOne({email});
      if(doctor)
      {
        const passwordCheck = await bcrypt.compare(password, doctor.password);
        if(passwordCheck)
        {
          return res.status(201).json({message: `welcome ${doctor.name}`});
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


//go together withe dashboard requests
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

const search = async (req, res) => {
  const {patientName} = req.body;
  try {
    let patient = await patientModel.findOne({name: patientName});
    if(!patient)
      return res.status(400).json({message: "Patient not found"});

    patient = patient.toObject();
    delete patient.password;
    return res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
}

const savHistory = async (req, res) => {
  const {patient, doctor, appointmentDate, diagnostic, prescription} = req.body;
  try {
    const valid = validator.saveValidator(req);
    if(!valid)
      return res.status(400).json({message: "input fields can't be empty"});
    const consultaion = await appointmentModel.findOne({
      patient,
      doctor,
      appointmentDate
    });

    if(!consultaion)
      return res.status(400).json({message: "invalid command"});

    consultaion.notes = diagnostic;
    consultaion.prescription = prescription

    await consultaion.save();

    res.status(201).json({ message: 'Saved successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});
  }
}

module.exports = {
  registerDoctor,
  login,
  search,
  savHistory
};