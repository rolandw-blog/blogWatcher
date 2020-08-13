const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
require("dotenv").config();

// * get a pages from the database by its id
/** Returns a promise that resolves to a single pages
 * or undefined if not found
 * @example
 * findPage("5f32c4d24191ed02244b62d6");
 */
const findPage = async (id) => {
	debug("Running findPage from db queries...");
	try {
		return Page.findOne({ _id: id }, "", (err, page) => {
			if (err) {
				debug(`ERROR retrieving pages from mongo ${err}`);
				return undefined;
			}

			if (!page) {
				debug("no page found");
				return undefined;
			}

			debug(`Found ${page.pageName}`);
			return page;
		});
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = findPage;
