const debug = require("debug")("blogWatcher:buildFiles");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const updateLocalPathOfPage = require("../queries/updateLocalPathOfPage");
require("dotenv").config();
const getAllPages = require("../queries/getAllPages");
const findPage = require("../queries/findPage");

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
const buildPage = async (_id) => {
	debug(`building page ${_id}`);
	const page = await findPage("_id", _id);

	// for every pageSource (url) in the page
	for (let i = 0; i < page.source.length; i++) {
		// debug(page);
		const pageSource = page.source[i];

		// download markdown stuff if its remote or read it
		// stuff thats local will be at "/" on the docker container if placed inside "app"
		const markdown = pageSource.remote
			? downloadMarkdown(pageSource.url)
			: fs.readFileSync(pageSource.url, "utf-8", () => {});

		const filename = page._id + `_${i}` + ".md";
		const writepath = path.resolve(process.env.ROOT, "content", filename);

		// write the file and then update the page.fsPath in the database
		fs.writeFile(writepath, await markdown, () => {
			debug(`wrote a file ${page._id}`);
			updateLocalPathOfPage(page, writepath);
		});
	}
};

module.exports = buildPage;
