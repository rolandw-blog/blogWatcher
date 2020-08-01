const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
require("dotenv").config();

// * get all pages in the database
/** Returns a promise that resolves to an array of pages
 * or undefined if not found
 * @example
 * getAllPages();
 */
const getAllPages = async () => {
	debug("Running getAllPages from db queries...");
	try {
		return Page.find({}, "", (err, pages) => {
			if (err) {
				debug(`ERROR retrieving pages from mongo ${err}`);
				return undefined;
			}

			if (!pages) {
				debug("ERROR no pages found");
				return undefined;
			}

			debug(`Returning ${pages.length} pages`);
			return pages;
		});
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = getAllPages;
