const express = require("express");
const buildRouter = require("./buildRouter");
const bodyParser = require("body-parser");
const updatePage = require("../controllers/updatePage");
const addPageSource = require("../controllers/addPageSource");
const verifyPayload = require("../middleware/verifyPayload");
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

// ! Single Sign On system
const isAuthenticated = require("../middleware/isAuthenticated");

const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

router.use(bodyParser.json());
router.use(urlencodedParser);

const routes = [
	{
		path: "/:id",
		method: "post",
		middleware: [],
		handler: updatePage,
		help: {
			description: "Update a document in the database",
			method: this.method,
			parameters: [],
			example: "/aaabbbccc",
		},
	},
	{
		path: "/history/add",
		method: "post",
		middleware: [],
		handler: addPageSource,
		help: {
			description: "Add source to a document in the database",
			method: this.method,
			parameters: [],
			example: "",
		},
	},
];

const help = [];
for (route in routes) {
	debug(route);
	help.push({
		path: route.path,
		method: route.method,
		help: route.help,
	});
}

// build the router!
debug("building the update routes");
buildRouter(router, routes);

module.exports = { router: router, help: help };
