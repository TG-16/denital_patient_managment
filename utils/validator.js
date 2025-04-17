
const inputValidator = (req) => {
    const { email, password} = req.body;
    if(!email || !password)
        return false;
    return true;
}

const historyValidator = (req) => {
    const {patient} = req.body;
    if(!patient)
        return false;
    return true;
}

const bookingValidator =(req) => {
    const {patient, doctor, appointmentDate, notes} = req.body;
    if(!patient || !doctor || !appointmentDate || !notes)
        return false;
    return true;
}

const ratingValidator = (req) => {
    const {rating, doctor} = req.body;
    if(!rating || !doctor)
        return false;
    if(rating < 0 || rating > 5)
        return false;
    if(typeof rating !== 'number')
        return false;
    return true;
}

const saveValidator = (req) => {
    const {patient, doctor, appointmentDate} = req.body;
    if(!patient || !doctor || !appointmentDate)
        return false;
    return true;
}

const dashboardValidator = (req) => {
    const {doctor} = req.body;
    if(!doctor)
        return false;
    return true;
}

const deleteValidator = (req) => {
    const {name, role} = req.body;
    if(!name || !role)
        return false;
    return true;
}

module.exports = {
    inputValidator,
    bookingValidator,
    historyValidator,
    ratingValidator,
    saveValidator,
    dashboardValidator,
    deleteValidator
}