const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');

function createApp() {
	const app = express();

	app.use(cors({
		origin: config.corsOrigins,
		credentials: true,
	}));

	app.use(express.json());
	app.use(cookieParser());

	app.get('/health', (req, res) => {
		res.json({ status: 'ok' });
	});

	app.use('/api', routes);

	app.use(notFoundHandler);
	app.use(errorHandler);

	return app;
}

module.exports = createApp;
