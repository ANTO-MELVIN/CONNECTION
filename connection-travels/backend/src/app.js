const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');

function createApp() {
	const app = express();

	app.use(cors({
		origin: [
			"http://localhost:5173", // admin
			"http://localhost:5174", // owner
			"http://localhost:5175", // user
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}));

	app.options("*", cors());

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
