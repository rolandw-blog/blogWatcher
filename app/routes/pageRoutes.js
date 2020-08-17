const express = require("express");
const postPage = require("../controllers/postPage");
const buildPages = require("../controllers/buildPages");
const buildPage = require("../controllers/buildPage");
const previewPages = require("../controllers/previewPages");
const getPage = require("../controllers/getPage");
const getPages = require("../controllers/getPages");
const bodyParser = require("body-parser");
const buildRouter = require("./buildRouter");
const verifyBuilderPayload = require("../middleware/verifyBuilderPayload");
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
	limit: "50mb",
	extended: true,
});

// ! remember to protect the POST /page route with
//  [urlencodedParser, verifyBuilderPayload]
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
		path: "/page/:id",
		method: "get",
		middleware: [],
		handler: getPage,
		help: {
			description: "Get a page from the database",
			method: this.method,
			example: "/page",
		},
	},
	{
		path: "/pages",
		method: "get",
		middleware: [],
		handler: getPages,
		help: {
			description: "Get a page from the database",
			method: this.method,
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
		path: "/build/:id",
		method: "get",
		middleware: [],
		handler: buildPage,
		help: {
			description: "Pull down and rebuild one page by its id",
			method: this.method,
			parameters: [],
			example: "/build/5f32c4dc4191ed02244b62d9",
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
