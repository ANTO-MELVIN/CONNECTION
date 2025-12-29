const http = require('http');
const config = require('./config/env');
const createApp = require('./app');
const { initSocket } = require('./lib/socket');

const app = createApp();
const server = http.createServer(app);

initSocket(server, config.corsOrigins);

const port = config.port;

server.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});
