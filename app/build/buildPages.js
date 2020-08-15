const debug = require("debug")("blogWatcher:buildFiles");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const updateLocalPathOfPage = require("../queries/updateLocalPathOfPage");
require("dotenv").config();
const getAllPages = require("../queries/getAllPages");
const buildPage = require("./buildPage");

const downloadMarkdown = async (url) => {
	url = decodeURI(url);
	debug("downloading page: ");
	debug(url);

	// fetch the content in async. await the response immediately
	const response = await fetch(url);

	if (response.status != 200) {
		debug(chalk.red(`Error fetching file: ${response.status}`));
	}

	// return the markdown text
	return await response.text();
};

/**
 * Pull the markdown from the database and put it in the content folder
 * @example buildPages()
 */
const buildPages = async () => {
	debug("getting all pages");
	const pages = await getAllPages();
	debug(`got ${pages.length} pages`);

	// for every page in the website
	for (const page of pages) {
		// for every pageSource (url) in the page
		buildPage(page._id);
	}
};

module.exports = buildPages;
