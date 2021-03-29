const { connectToDB } = require("../database/database");
const debug = require("debug")("blogWatcher:server");
const path = require("path");
const express = require("express");
const cors = require("cors");
const pageRoutes = require("../routes/pageRoutes.js");
const webhooks = require("../routes/webhooks");
const updateRoutes = require("../routes/updateRoutes");
const historyRoutes = require("../routes/historyRoutes");
const bodyParser = require("body-parser");
const ip = require("internal-ip");
const {
	useCorsMiddleware,
	useJsonMiddleware,
	useTestMiddleware,
} = require("./middleware");
require("dotenv").config();

const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.options("*", cors());

app.use(express.json()); // support application/json on all routes

// ? optional use express x-www-urlencoded parser
// ? right now im using body-parser instead
// app.use(express.urlencoded({ extended: true }));

// all the page routes live here
app.use("/", pageRoutes.router);

// github webhooks live here
app.use("/hooks", webhooks.router);

// page update routes live here
app.use("/update", updateRoutes.router);

// history routes live here
app.use("/history", historyRoutes.router);

// set the rendering engine
app.set("view engine", "ejs");
app.set("views", path.resolve(process.env.ROOT, "views"));

// starts the server when called
const server = async () => {
	// connect to mongodb database
	await connectToDB();

	// start the server
	app.listen(process.env.PORT, async () =>
		debug(
			`app listening at ${process.env.PROTOCOL}://${await ip.v4()}:${
				process.env.PORT
			}`
		)
	);

	app.get("/", (req, res, next) => {
		res.status(200).json(pageRoutes.help);
	});
};

module.exports = server();
