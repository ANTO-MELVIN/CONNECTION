const config = require('./config/env');
const createApp = require('./app');
const { initSocket } = require('./lib/socket');

const app = createApp();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

initSocket(server, config.corsOrigins);
