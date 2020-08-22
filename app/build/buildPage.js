const debug = require("debug")("blogWatcher:buildFile");
const fs = require("fs");
const path = require("path");
const updateLocalPathOfPage = require("../queries/updateLocalPathOfPage");
require("dotenv").config();
const findPage = require("../queries/findPage");
const downloadMarkdown = require("./downloadMarkdown");
const hookWebsite = require("./hookWebsite");

/**
 * Pull the markdown from the database and put it in the content folder
 * @example buildPages()
 */
const buildPage = async (_id) => {
	debug(`building page: ${_id}`);
	const page = await findPage("_id", _id);
	let markdownOutput = "";

	debug(`downloading sources for "${page.pageName}"`);
	for (let i = 0; i < page.source.length; i++) {
		const pageSource = page.source[i];

		// download markdown stuff if its remote or read it
		const markdown = pageSource.remote
			? await downloadMarkdown(pageSource.url)
			: fs.readFileSync(pageSource.url, "utf-8", () => {});

		markdownOutput += markdown;

		const filename = page._id + `_${i}` + ".md";
		const writepath = path.resolve(process.env.ROOT, "content", filename);

		// ? For storing the page within blog watcher you can use this
		// ? however its not required as the website builder is immiediately sent the markdown
		// ? so there is no performance gain for keeping it here
		if (process.env.MD_STORE_LOCALLY == "true") {
			// write the file and then update the page.fsPath in the database
			fs.writeFile(writepath, markdown, () => {
				debug(`wrote a file ${page._id} to ${writepath}`);
			});
			updateLocalPathOfPage(page, writepath);
		}
	}

	debug(`finished downloading sources for "${page.pageName}"`);

	// send the changes to the blog
	return hookWebsite(
		page,
		markdownOutput != "" ? markdownOutput : undefined,
		"http://192.168.0.100:2020/download"
	)
		.then(() => {
			debug("finished posting markdown to blog");
			return page;
		})
		.catch((err) => {
			debug(
				`failed to post markdown to blog builder. Perhaps its down? ${err}`
			);
			return undefined;
		});
};

module.exports = buildPage;
