const express = require("express");
const buildRouter = require("./buildRouter");
const bodyParser = require("body-parser");
const updatePage = require("../controllers/updatePage");
const addPageSource = require("../controllers/addPageSource");
// const verifyPayload = require("../middleware/verifyPayload");
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

router.use(bodyParser.json());
router.use(urlencodedParser);

const routes = [
	// update 1 field, takes a {filter, update}
	{
		path: "/:_id",
		method: "patch",
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
		path: "/history/:_id",
		// add 1 field
		method: "patch",
		middleware: [],
		handler: addPageSource,
		help: {
			description: "Add a source to a page in the database",
			method: this.method,
			parameters: [],
			example: "/aaabbbccc",
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
