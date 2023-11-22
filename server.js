const http = require('http');
const app = require('./app');

const server = http.createServer(app);
server.on('listening', onListening);
server.on('error', onError);

const port = normalizePort(process.env.PORT ?? '3000');
server.listen(port);

function onListening() {
  const addr = server.address();
  if (addr) {
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      break;
    default:
      console.error('Error: ' + error.message);
  }
}

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (!isNaN(port) && port >= 0) {
    return port;
  }
  return null;
}
