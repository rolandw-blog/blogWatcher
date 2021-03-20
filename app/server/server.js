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

debug("============================================");
debug("Blog watcher is starting...");
debug(`WORKING IN:\t${process.env.ROOT}`);
debug(`RUNNING ON PORT:\t${process.env.PROTOCOL}`);
debug("============================================");

const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.options("*", cors());

// Support x-www-urlencoded on all routes
const urlencodedParser = bodyParser.urlencoded({
	limit: "50mb",
	extended: true,
});
app.use(urlencodedParser);

// support application/json on all routes
app.use(express.json());

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

	// quick and dirty upload form
	//app.get("/upload", (req, res, next) => {
	//	debug("rendering /upload");
	//	return res.status(200).render("index", {});
	//});

	// ! Single Sign On system
	app.get("/", (req, res, next) => {
		debug(`hit ${req.url}`);
		// const now = new Date().toISOString();
		// debug(`This session is: ${req.session.id}`);
		res.status(200).json({
			title: "Blog Builder | Home",
			pageroutes: pageRoutes.help,
		});
	});

	// ! Single Sign On system (error handling)
	app.use((err, req, res, next) => {
		if (err) debug("some ERROR occurred:");
		console.error({
			message: err.message,
			error: err,
		});
		const statusCode = err.status || 500;
		let message = err.message || "Internal Server Error";

		debug(statusCode);

		if (statusCode === 500) {
			message = "Internal Server Error";
		}
		res.status(statusCode).json({
			message: message,
			returnCode: statusCode,
			actualStatusCode: err.statusCode,
			query: req.query,
			route: req.route,
			err: {
				error: err,
				errorMessage: err.message,
			},
			url: {
				params: req.params,
				url: req.url,
				ogURL: req.originalUrl,
				baseURL: req.baseURL,
				hostname: req.hostname,
				path: req.path,
			},
			cookies: req.cookies,
		});
	});
};

module.exports = server();
