const express = require("express");
const postPage = require("../controllers/postPage");
const buildPages = require("../controllers/buildPages");
const previewPages = require("../controllers/previewPages");
const bodyParser = require("body-parser");
const buildRouter = require("./buildRouter");
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const routes = [
	{
		path: "/page",
		method: "post",
		middleware: [urlencodedParser],
		handler: postPage,
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
	{
		path: "/build",
		method: "get",
		middleware: [],
		handler: buildPages,
		help: {
			description: "Pull down and rebuild all the pages",
			method: this.method,
			parameters: [],
			example: "/build",
		},
	},
	{
		path: "/preview",
		method: "get",
		middleware: [],
		handler: previewPages,
		help: {
			description: "Preview the site structure",
			method: this.method,
			parameters: [],
			example: "/preview",
		},
	},
];

// build the router!
debug("building the page routes");
buildRouter(router, routes);

module.exports = router;
