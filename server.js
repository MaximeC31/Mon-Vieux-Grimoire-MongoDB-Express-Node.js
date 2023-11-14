const http = require('http');
const app = require('./app');

// Fonction de normalisation du port
const normalizePort = (val) => parseInt(val, 10) || false;

// Fonction de gestion des erreurs
const errorHandler = (error, port) => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof server.address() === 'string' ? 'pipe ' + server.address() : 'port: ' + port;

  console.error(`${bind} ${error.code === 'EACCES' ? 'nécessite des privilèges élevés.' : 'est déjà utilisé.'}`);
  process.exit(1);
};

// Configuration et création du serveur
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Gestion des erreurs, écoute et démarrage du serveur
const server = http.createServer(app);
server
  .on('error', (error) => errorHandler(error, port))
  .on('listening', () => console.log(`En écoute sur ${typeof server.address() === 'string' ? 'pipe ' + server.address() : 'port ' + port}`))
  .listen(port);
