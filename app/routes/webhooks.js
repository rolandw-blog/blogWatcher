const express = require("express");
const buildRouter = require("./buildRouter");
const bodyParser = require("body-parser");
const ghwebhook = require("../controllers/ghwebhook");
const verifyGithubPayload = require("../middleware/verifyGithubPayload");
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(bodyParser.json());

const routes = [
	{
		path: "/github",
		method: "post",
		middleware: [urlencodedParser, verifyGithubPayload],
		handler: ghwebhook,
		help: {
			description: "Post a page to the database",
			method: this.method,
			parameters: [
				"pageName: string",
				'type: ("remote" or "local")',
				"path: string",
			],
			example: "/page",
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
debug("building the webhook routes");
buildRouter(router, routes);

module.exports = { router: router, help: help };
