const debug = require("debug")("blogWatcher:buildFile");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const updateLocalPathOfPage = require("../queries/updateLocalPathOfPage");
require("dotenv").config();
const getAllPages = require("../queries/getAllPages");
const findPage = require("../queries/findPage");
const downloadMarkdown = require("./downloadMarkdown");

/**
 * Pull the markdown from the database and put it in the content folder
 * @example buildPages()
 */
const buildPage = async (_id) => {
	const jobs = [];
	const page = await findPage("_id", _id);

	// for each source (url in page.source[])
	if (page.source.length == 0) {
		return false;
	} else {
		debug(`downloading sources for "${page.pageName}"`);
	}
	for (let i = 0; i < page.source.length; i++) {
		const pageSource = page.source[i];

		// download markdown stuff if its remote or read it
		// stuff thats local will be at "/" on the docker container if placed inside "app"
		const markdown = pageSource.remote
			? await downloadMarkdown(pageSource.url)
			: fs.readFileSync(pageSource.url, "utf-8", () => {});

		const filename = page._id + `_${i}` + ".md";
		const writepath = path.resolve(process.env.ROOT, "content", filename);

		// write the file and then update the page.fsPath in the database
		const writeJob = fs.writeFile(writepath, markdown, () => {
			debug(`wrote a file ${page._id}`);
			updateLocalPathOfPage(page, writepath);
		});

		jobs.push(writeJob);
	}

	// debug("waiting for sources to download");
	await Promise.all(jobs);
	debug(`finished downloading sources for "${page.pageName}"`);
	return true;
};

module.exports = buildPage;
