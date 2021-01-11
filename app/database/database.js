const mongoose = require("mongoose");
const ora = require("ora");
const util = require("util");
const debug = require("debug")("blogWatcher:database");
require("dotenv").config();

// allow update commands
mongoose.set("useFindAndModify", false);

// the database connection object
const db = mongoose.connection;

// Create a dank loading effect
const spinner = ora("Connecting to MongoDB...");
spinner.spinner = {
	interval: 100,
	frames: ["▹▹▹▹▹", "▸▹▹▹▹", "▹▸▹▹▹", "▹▹▸▹▹", "▹▹▹▸▹", "▹▹▹▹▸"],
};

const connectToDB = async () => {
	// connect to the service name, not the container_name
	// the connection URI should look something like...
	// mongodb://roland:password@1.2.3.4:27017/blogWatcher?authSource=blogWatcher
	const url = process.env.MONGO_URI;

	debug(`authenticating as:\n${url}`);

	const connectionSchema = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	spinner.start();

	const con = util.promisify(mongoose.connect);
	return con(url, connectionSchema);
};

/**
 * Returns a promise that resolves to true or false after the database has closed
 */
const disconnectFromDB = async () => {
	return new Promise((resolve, reject) => {
		db.close((err) => {
			if (err) reject(err);
			else resolve("🗄 disconnected from the database");
		});
	})
		.then((success) => {
			debug(`success: ${success}`);
			return true;
		})
		.catch((err) => {
			debug(err);
			return false;
		});
};

db.once("open", function () {
	spinner.succeed(" MongoDB database connection established successfully");
});

// throw an error if database conn fails
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = { db, connectToDB, disconnectFromDB };
