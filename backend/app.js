require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { globalError, handleNotFound } = require('./middlewares/globalErrorHandler');
//import routes here
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const clientRoutes = require('./routes/client.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://se.agency',
    'https://www.se.agency',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/health', (req, res) => {
  res.status(200).send('OK');
});

// TODO: Add your routes here
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);

app.use(handleNotFound);
app.use(globalError);

module.exports = app;
