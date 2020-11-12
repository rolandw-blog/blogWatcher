const express = require("express");
const buildRouter = require("./buildRouter");
const bodyParser = require("body-parser");
const findHistory = require("../controllers/findHistory");
const verifyPayload = require("../middleware/verifyPayload");
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({
	extended: false,
});

router.use(bodyParser.json());
router.use(urlencodedParser);

const routes = [
	{
		path: "/find/:_id",
		method: "post",
		middleware: [urlencodedParser, verifyPayload],
		handler: findHistory,
		help: {
			description: "Find history for a page id in the database",
			method: this.method,
			parameters: ["_id: string"],
			example: "/",
		},
	},
];

const help = [];
for (route in routes) {
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
