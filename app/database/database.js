const mongoose = require("mongoose");
const util = require("util");
const debug = require("debug")("blogWatcher:database");
require("dotenv").config();

// allow update commands
mongoose.set("useFindAndModify", false);

// the database connection object
const db = mongoose.connection;

const connectToDB = async () => {
	// connect to the service name, not the container_name
	// the connection URI should look something like...
	// mongodb://roland:password@1.2.3.4:27017/blogWatcher?authSource=blogWatcher
	const url = process.env.MONGO_URI;

	const connectionSchema = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

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
	debug("MongoDB database connection established successfully");
});

// throw an error if database conn fails
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = { db, connectToDB, disconnectFromDB };
