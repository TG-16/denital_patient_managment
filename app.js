const express = require('express');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/patientRoute');
const receptionRoutes = require('./routes/receptionRoute');
const doctorRoutes = require('./routes/doctorRoute');
const indexRoute = require('./routes/indexRoute');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config(); // Load environment variables

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(morgan('dev')); // Logging middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api', indexRoute); // Main API route
app.use('/api/patients', patientRoutes);
app.use('/api/reception', receptionRoutes); // Reception route
app.use('/api/doctors', doctorRoutes); // Doctor route

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
