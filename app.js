const express = require('express');

const app = express();

// Middleware pour logguer les requêtes reçues
app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

// Middleware pour configurer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

// Route pour récupérer des objets sous '/api/stuff'
app.get('/api/stuff', (req, res) => {
  const stuff = ['C"est une requête GET'];
  res.status(200).json(stuff);
});

// Route pour récupérer des objets sous '/api/stuff'
app.post('/api/stuff', (req, res) => {
  const stuff = ['C"est une requête POST'];
  console.log(req.body);
  res.status(200).json(req.params);
});

// Middleware pour définir un statut HTTP 201
app.use((req, res, next) => {
  res.status(201);
  next();
});

// Middleware pour renvoyer une réponse JSON
app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

// Middleware pour logguer la réponse envoyée avec succès
app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

module.exports = app;
