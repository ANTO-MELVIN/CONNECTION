const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');
const config = require('./config/env');

function createApp() {
	const app = express();

	const corsOptions = {
		origin: config.corsOrigins,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	};

	app.use(cors(corsOptions));

	app.options("*", cors(corsOptions));

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
