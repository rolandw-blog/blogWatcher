const express = require("express");
const postPage = require("../controllers/postPage");
const buildPages = require("../controllers/buildPages");
const buildPage = require("../controllers/buildPage");
const previewPages = require("../controllers/previewPages");
const getPage = require("../controllers/getPage");
const getPages = require("../controllers/getPages");
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

// ! remember to protect the POST /page route with
//  [urlencodedParser, verifyPayload]
const routes = [
	{
		path: "/upload",
		method: "post",
		middleware: [urlencodedParser, isAuthenticated],
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
		path: "/page",
		method: "post",
		middleware: [verifyPayload],
		handler: getPage,
		help: {
			description: "Get a page from the database",
			method: this.method,
			example: "/page",
		},
	},
	{
		path: "/page",
		method: "get",
		middleware: [isAuthenticated],
		handler: getPage,
		help: {
			description: "Get a page from the database",
			method: this.method,
			example: "/page",
		},
	},
	{
		path: "/pages",
		method: "post",
		middleware: [verifyPayload],
		handler: getPages,
		help: {
			description: "Get all pages from the database",
			method: this.method,
			example: "/pages",
		},
	},
	{
		path: "/pages",
		method: "get",
		middleware: [isAuthenticated],
		handler: getPages,
		help: {
			description: "Get all pages from the database",
			method: this.method,
			example: "/pages",
		},
	},
	{
		path: "/build",
		method: "get",
		middleware: [isAuthenticated],
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
		middleware: [isAuthenticated],
		handler: buildPage,
		help: {
			description: "Pull down and rebuild one page by its id",
			method: this.method,
			parameters: [],
			example: "/build/5f32c4dc4191ed02244b62d9",
		},
	},
	{
		path: "/build/:id",
		method: "post",
		middleware: [verifyPayload],
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
		middleware: [isAuthenticated],
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
