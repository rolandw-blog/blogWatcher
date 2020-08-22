const { connectToDB } = require("../database/database");
const debug = require("debug")("blogWatcher:server");
const path = require("path");
const express = require("express");
const cors = require("cors");
const pageRoutes = require("../routes/pageRoutes.js");
const webhooks = require("../routes/webhooks");
require("dotenv").config();

const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.options("*", cors());

// ? optional use express x-www-urlencoded parser
// ? right now im using body-parser instead
// app.use(express.urlencoded({ extended: true }));

// all the page routes live here
app.use("/", pageRoutes);

// github weebhooks live here
app.use("/hooks", webhooks);

// quick and dirty upload form
app.use("/upload", express.static(path.resolve(process.env.ROOT, "public")));

// starts the server when called
const server = async () => {
	// connect to mongodb database
	await connectToDB(
		process.env.DB_USERNAME,
		process.env.DB_PASSWORD,
		process.env.DB_PORT,
		process.env.DB_DATABASE,
		process.env.DB_AUTHENTICATION_DATABASE
	);

	// start the server
	app.listen(process.env.PORT, () =>
		debug(
			`app listening at ${process.env.PROTOCOL}://localhost:${process.env.PORT}`
		)
	);

	// fallback for root path
	app.get("/", (req, res) => {
		res.status(200).json({
			success: true,
			help: "post to /page to upload a new page",
		});
	});
};

module.exports = server();
