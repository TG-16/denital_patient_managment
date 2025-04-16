const express = require('express');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/patientRoute');
const receptionRoutes = require('./routes/receptionRoute');
const doctorRoutes = require('./routes/doctorRoute');
const indexRoute = require('./routes/indexRoute');
const adminRoute = require("./routes/adminRoute");
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config(); 

const app = express();

connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', indexRoute);
app.use('/api/patients', patientRoutes);
app.use('/api/reception', receptionRoutes); 
app.use('/api/doctors', doctorRoutes); 
app.use('/api/admin', adminRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
