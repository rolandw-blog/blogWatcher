const debug = require("debug")("blogWatcher:buildFiles");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const updateLocalPathOfPage = require("../queries/updateLocalPathOfPage");
require("dotenv").config();
const getAllPages = require("../queries/getAllPages");

const downloadMarkdown = async (url) => {
	url = decodeURI(url);
	debug("downloading page: " + url);

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

	// debug(pages);

	for (const page of pages) {
		// download markdown stuff
		const markdown = downloadMarkdown(page.source.path);

		const filename = page._id + ".md";
		const writepath = path.resolve(process.env.ROOT, "content", filename);

		// write the file and then update the page.fsPath in the database
		fs.writeFile(writepath, await markdown, () => {
			debug(`wrote a file ${page._id}`);
			updateLocalPathOfPage(page, writepath);
		});
	}
};

module.exports = buildPages;
