const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
const pageSchema = require("../validation/pageSchema");
const findPage = require("./findPage");
require("dotenv").config();

// ! A page should have
// page.pageName			string
// page.source.remote		string
// page.source.path			array
// page.websitePath			string
// page.meta.template		string

/**
 * Saves a page to the database
 * @param {JSON} page - A page json object to save to the database
 * @returns Appropriate HTTP code
 * @example postPage({
 *	pagename: "name",
 *	websitePath: "page/goes/here"
 *	source: {
 *	remote: true,
 *	path: ["www.page.com/text.md"]
 *	},
 *	meta: {
 *	template: "template.ejs"
 *	}
 *	})
 */
const postPage = async (page) => {
	// check its a valid page against the yup schema
	try {
		await pageSchema.validate(page);
	} catch (err) {
		debug(`error: ${err.name}`);
		debug(err.errors);
		return 409;
	}

	debug(`checking ${page.pageName} doesnt exist before saving`);
	const existingPageName = await findPage("pageName", page.pageName);
	const existingPagePath = await findPage("websitePath", page.websitePath);
	if (!existingPageName && !existingPagePath) {
		const newPage = new Page(page);
		return newPage.save().then((doc) => {
			debug(`Saved ${doc._id}`);
			return 200;
		});
	} else {
		debug(`the page ${page.pageName} already exists`);
		return 400;
	}
};

module.exports = postPage;
