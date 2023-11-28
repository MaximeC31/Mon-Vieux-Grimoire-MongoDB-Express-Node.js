const fs = require('fs');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Middleware: Request Logging
app.use((req, res, next) => {
  console.log('Request received');

  const { headers, ip, url, hostname } = req;
  const logObject = {
    time: new Date().toLocaleString(),
    headers,
    ip,
    url,
    hostname
  };

  const logs = JSON.stringify(logObject, null, 2) + '\n';
  fs.appendFile('server.log', logs, (error) => {
    if (error) {
      console.error('Error writing to server.log:', error);
    }
  });

  next();
});

// Middleware: CORS Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    await mongoose.connect(
      'mongodb+srv://maximec31:IQd5b6M7weufy4em@atlascluster.extoiwy.mongodb.net/?retryWrites=true&w=majority',
      connectionOptions
    );

    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Connection to MongoDB failed!', error);
  }
};
connectToMongoDB();

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
app.use(express.json());

// Apps routes
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

// Middleware : send response to all routes
app.use(async (req, res, next) => {
  try {
    res.status(200).send('This is the generic response');
    console.log('Response OK');
  } catch (error) {
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
    console.error(error.stack);
  }
});

module.exports = app;
