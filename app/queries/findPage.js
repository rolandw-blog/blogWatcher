const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
require("dotenv").config();

// * get all pages in the database
/** Returns a promise that resolves to an array of pages
 * or undefined if not found
 * @example
 * getAllPages();
 */
const findPage = async (pageName) => {
	debug("Running getAllPages from db queries...");
	try {
		return Page.findOne({ pageName: pageName }, "", (err, page) => {
			if (err) {
				debug(`ERROR retrieving pages from mongo ${err}`);
				return undefined;
			}

			if (!page) {
				debug("no page found");
				return null;
			}

			debug(`Found ${page.pageName}`);
			return page;
		});
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = findPage;
