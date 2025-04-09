const patientController = require('./patientController');
const doctorController = require('./doctorController');
const receptionController = require("./receptionController");

const register = async (req, res) => {
    const role = req.body.role;
    switch (role) {
        case 'patient':
            await patientController.registerPatient(req, res);
            break;
        case 'doctor':
            await doctorController.registerDoctor(req, res);
            break;
        case 'reception':
            await receptionController.registerReception(req, res);
            break;
        default:
            res.status(400).json({ message: 'Invalid role' });
    }
}

const login = async (req, res) => {
    const role = req.body.role;
    switch (role) {
        case 'patient':
            await patientController.login(req, res);
            break;
        case 'doctor':
            await doctorController.login(req, res);
            break;
        case 'reception':
            await receptionController.login(req, res);
            break;
        default:
            res.status(400).json({ message: 'Invalid role' });
    }
}

module.exports = {
    register,
    login
};
