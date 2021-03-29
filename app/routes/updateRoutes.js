const express = require("express");
const buildRouter = require("./buildRouter");
const updateRouter = require("../controllers/UpdateRoutes/updateRouter")
const debug = require("debug")("blogWatcher:routers");
const router = express.Router();

const routes = [
	// update 1 field, takes a {filter, update}
	{
		path: "/:field",
		method: "patch",
		middleware: [],
		handler: updateRouter,
		help: {
			description: "Update a document in the database",
			method: this.method,
			parameters: [],
			example: "/aaabbbccc",
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
buildRouter(router, routes);

module.exports = { router: router, help: help };
