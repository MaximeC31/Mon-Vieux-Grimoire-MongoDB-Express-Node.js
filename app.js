const express = require('express');
const app = express();

const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// Get a log of all API activities
app.use((req, res, next) => {
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

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
