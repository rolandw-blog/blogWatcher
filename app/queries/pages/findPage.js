const { Page } = require("../../models/page");
const getPerPage = require("./common/getPerPage");
const getSkipCount = require("./common/getSkipCount");
const debug = require("debug")("v_blogWatcher:query");
require("dotenv").config();

/**
 * get a pages from the database
 * @returns Returns a promise that resolves to an array of pages
 */
const findPage = async (query, pageNumber, perPage) => {
	console.log("running query...");

	if (!pageNumber) pageNumber = 0;
	if (!perPage) perPage = 999;

	// Internally control's how many values to skip to give the illusion of pages
	const skipCount = getSkipCount(pageNumber, perPage);

	// how many items per page - ?per_page
	const per_page = getPerPage(perPage);

	try {
		return Page.find(
			query,
			"",
			{ skip: skipCount, limit: per_page },
			(err, page) => {
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
			}
		);
	} catch (err) {
		debug(`ERROR async block failed ${err}`);
		return undefined;
	}
};

module.exports = findPage;
