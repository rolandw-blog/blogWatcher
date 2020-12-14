const express = require("express");
const postPage = require("../controllers/postPage");
const deletePage = require("../controllers/deletePage");
const buildPages = require("../controllers/buildPages");
const buildPage = require("../controllers/buildPage");
const previewPages = require("../controllers/previewPages");
const getPage = require("../controllers/getPage");
const getPages = require("../controllers/getPages");
const getPagesFilter = require("../controllers/getPagesFilter");
const bodyParser = require("body-parser");
const buildRouter = require("./buildRouter");
const verifyPayload = require("../middleware/verifyPayload");
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

// ! Single Sign On system
const isAuthenticated = require("../middleware/isAuthenticated");

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
	limit: "50mb",
	extended: true,
});

router.use(bodyParser.json());

// ! remember to protect the POST /page route with
//  [urlencodedParser, verifyPayload]
const routes = [
	{
		path: "/upload",
		method: "post",
		// isAuthenticated
		middleware: [],
		handler: postPage,
		help: {
			description: "Post a page to the database",
			method: this.method,
			parameters: [
				"pageName: string",
				'type: ("remote" or "local")',
				"path: string",
			],
			example: "/upload",
		},
	},
	{
		path: "/delete/:_id",
		method: "post",
		// isAuthenticated
		middleware: [],
		handler: deletePage,
		help: {
			description: "Delete a page from the database",
			method: this.method,
			parameters: ["id"],
			example: "/delete/abcd1234",
		},
	},
	{
		path: "/page",
		method: "get",
		// isAuthenticated
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
		// verifyPayload
		middleware: [],
		handler: getPages,
		help: {
			description: "Get all pages from the database",
			method: this.method,
			example: "/pages",
		},
	},
	{
		path: "/pages/:filter/:value",
		method: "get",
		// verifyPayload
		middleware: [],
		handler: getPagesFilter,
		help: {
			description: "Get all pages from the database",
			method: this.method,
			example: "/pages",
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

const help = [];
for (route of routes) {
	debug(route);
	help.push({
		path: route.path,
		method: route.method,
		help: route.help,
	});
}

// build the router!
debug("building the page routes");
buildRouter(router, routes);

module.exports = { router: router, help: help };
