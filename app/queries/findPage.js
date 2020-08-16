const { Page } = require("../models/page");
const debug = require("debug")("v_blogWatcher:query");
require("dotenv").config();

// * get a pages from the database by its id
/** Returns a promise that resolves to a single pages
 * or undefined if not found
 * @example
 * findPage("_id", "5f32c4d24191ed02244b62d6");
 * findPage("pageName", "testPage");
 */
const findPage = async (key, value) => {
	debug("Running findPage from db queries...");
	try {
		debug(`looking for ${key} = ${value}`);
		return Page.findOne({ [key]: value }, "", (err, page) => {
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
