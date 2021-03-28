const express = require("express");
const postPage = require("../controllers/pageRoutes/postPage");
const deletePage = require("../controllers/pageRoutes/deletePage");
const getPage = require("../controllers/getPage");
const getPages = require("../controllers/getPages");
const buildRouter = require("./buildRouter");
const router = express.Router();

const routes = [
	{
		path: "/upload",
		method: "post",
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
			description: "Get all pages from the database",
			method: this.method,
			example: "/pages",
		},
	},
];

const help = [];
for (route of routes) {
	help.push({
		path: route.path,
		method: route.method,
		help: route.help,
	});
}

// build the router!
buildRouter(router, routes);

module.exports = { router: router, help: help };
