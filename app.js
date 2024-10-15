// app.js
const express = require('express');
const app = express();
const presentationRoutes = require('./routes/presentationRoutes');
const path = require('path');
require('dotenv').config();
const sequelize = require('./db/db');
const cors = require('cors');

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/', presentationRoutes);

// Test DB connection and sync models
sequelize.sync().then(() => {
  console.log('Database connected and tables created');
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
