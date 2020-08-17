const debug = require("debug")("blogWatcher:buildFiles");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const updateLocalPathOfPage = require("../queries/updateLocalPathOfPage");
require("dotenv").config();
const getAllPages = require("../queries/getAllPages");
const buildPage = require("./buildPage");

/**
 * Pull the markdown from the database and put it in the content folder
 * @example buildPages()
 */
const buildPages = async () => {
	debug("getting all pages");
	const pages = await getAllPages();
	const jobs = [];
	debug(`got ${pages.length} pages`);

	// for every page in the website
	for (const page of pages) {
		// for every pageSource (url) in the page
		jobs.push(buildPage(page._id));
	}
	await Promise.all(jobs);
	debug("Finished downloading pages");
	return true;
};

module.exports = buildPages;
