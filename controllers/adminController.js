const receptionModel = require('../models/reception');
const validator = require("../utils/validator");
const appointmentModel = require("../models/appointment");
const doctorModel = require("../models/doctor");
const patientModel = require('../models/patient');

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

    doctors.sort((a,b) => b.averageRating - a.averageRating);
    res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});
  }
}

const getReceptions = async (req,res) => {
    try {
      const reception = await receptionModel.find({});
      if(reception.length === 0)
        return res.status(404).json({message: "No reception found"});

      res.status(200).json(reception);
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Server error", error});
    }
  }

  const getPatients = async (req,res) => {
    try {
      const patients = await patientModel.find({});
      if(patients.length === 0)
        return res.status(404).json({message: "No patients found"});

      res.status(200).json(patients);
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Server error", error});
    }
  }


const deleteUser = async (req,res) => {
  const {name, role} = req.body;
  try {
    const valid = validator.deleteValidator(req);
    if(!valid)
      return res.status(400).json({message: "input fields can't be empty"});
    
    else
    {
        switch (role) {
                case 'patient':
                    const patient = await patientModel.findOneAndDelete({name});
                    if(!patient)
                      return res.status(404).json({message: "patient not found"});
                    res.status(200).json({ message: 'Deleted successfully!' });
                    break;
                case 'doctor':
                    const doctor = await doctorModel.findOneAndDelete({name});
                    if(!doctor)
                      return res.status(404).json({message: "doctor not found"});
                    res.status(200).json({ message: 'Deleted successfully!' });
                    break;
                case 'reception':
                    const reception = await receptionModel.findOneAndDelete({name});
                    if(!reception)
                      return res.status(404).json({message: "reception not found"});
                    res.status(200).json({ message: 'Deleted successfully!' });
                    break;
                default:
                    res.status(400).json({ message: 'Invalid role' });
            }
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error", error});
  }
}

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
      const admin = await adminModel.findOne({email});
      if(admin)
      {
        const passwordCheck = await bcrypt.compare(password, admin.password);
        if(passwordCheck)
        {
          return res.status(201).json({message: `welcome ${admin.name}`});
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

module.exports = {
    todaysAppointments,
    getDoctors,
    getPatients,
    getReceptions,
    deleteUser,
    login
};