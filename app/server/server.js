const { connectToDB } = require("../database/database");
const debug = require("debug")("blogWatcher:server");
const path = require("path");
const express = require("express");
const cors = require("cors");
const pageRoutes = require("../routes/pageRoutes.js");
const webhooks = require("../routes/webhooks");
const updateRoutes = require("../routes/updateRoutes");
const bodyParser = require("body-parser");
const session = require("express-session");
const checkSSORedirect = require("../middleware/checkSSORedirect");
const isAuthenticated = require("../middleware/isAuthenticated");
const ip = require("internal-ip");
require("dotenv").config();

debug("============================================");
debug("Blog watcher is starting...");
debug(`WORKING IN:\t${process.env.ROOT}`);
debug(`RUNNING ON PORT:\t${process.env.PROTOCOL}`);
debug(`Builder IP:\t${process.env.PROTOCOL}:${process.env.BLOG_IP}`);
debug("============================================");

const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.options("*", cors());

// express session configuration
// ! Single Sign On system
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 3600000,
		},
	})
);

// check for sign on communications from the sso server
// ! Single Sign On system
app.use(checkSSORedirect());

// Support x-www-urlencoded on all routes
const urlencodedParser = bodyParser.urlencoded({
	limit: "50mb",
	extended: true,
});
app.use(urlencodedParser);

// ? optional use express x-www-urlencoded parser
// ? right now im using body-parser instead
// app.use(express.urlencoded({ extended: true }));

// all the page routes live here
app.use("/", pageRoutes.router);

// github weebhooks live here
app.use("/hooks", webhooks.router);

// page update routes live here
app.use("/update", updateRoutes.router);

// set the rendering engine
app.set("view engine", "ejs");
app.set("views", path.resolve(process.env.ROOT, "views"));

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
	app.listen(process.env.PORT, async () =>
		debug(
			`app listening at ${process.env.PROTOCOL}://${await ip.v4()}:${
				process.env.PORT
			}`
		)
	);

	// quick and dirty upload form
	app.get("/upload", isAuthenticated, (req, res, next) => {
		debug("rendering /upload");
		return res.status(200).render("index", {});
	});

	// ! Single Sign On system
	app.get("/", isAuthenticated, (req, res, next) => {
		debug(`hit ${req.url}`);
		// const now = new Date().toISOString();
		debug(`This session is: ${req.session.id}`);
		res.status(200).json({
			what: `SSO-Consumer One`,
			title: "Blog Builder | Home",
			role: req.session.user.role,
			email: req.session.user.email,
			uid: req.session.user.uid,
			globalSessionID: req.session.user.globalSessionID,
			iat: req.session.user.iat,
			exp: req.session.user.exp,
			iss: req.session.user.iss,
			cookie: req.session.cookie || "not sure",
			expires: req.session.cookie.maxAge / 1000 + "'s",
			pageroutes: pageRoutes.help,
		});
	});

	// ! Single Sign On system (error handling)
	// ? only use when API endpoints are being used. IE. only returning JSON, will not work with ejs or express public dirs
	// app.use((req, res, next) => {
	// 	// catch 404 and forward to error handler
	// 	const err = new Error("Resource Not Found");
	// 	err.status = 404;
	// 	next(err);
	// });

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
