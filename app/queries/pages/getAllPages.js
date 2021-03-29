const { Page } = require("../../models/page");
const debug = require("debug")("blogWatcher:query");
const mongoose = require("mongoose");
const getPerPage = require("./common/getPerPage");
const getSkipCount = require("./common/getSkipCount");
require("dotenv").config();

// * get all pages in the database
/** Returns a promise that resolves to an array of pages
 * or undefined if not found
 * @example
 * getAllPages({});
 * @example
 * getAllPages({pageName: "home"});
 */
const getAllPages = async (filters, pageNumber, perPage) => {
	debug("Running getAllPages from db queries...");

	if (pageNumber === undefined) pageNumber = 0;
	if (perPage === undefined) perPage = 10;

	// only return pages that should be built
	filters = {
		...filters,
		hidden: false,
	};

	debug(filters);

	// Internally control's how many values to skip to give the illusion of pages
	const skipCount = getSkipCount(pageNumber, perPage);

	// ##──── Queries ───────────────────────────────────────────────────────────────────────────
	// how many items per page - ?per_page
	const per_page = getPerPage(perPage);

	// ##──── Run the query ─────────────────────────────────────────────────────────────────────
	try {
		return Page.find(
			filters,
			"",
			{ skip: skipCount, limit: per_page },
			(err, pages) => {
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
			}
		);
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = getAllPages;
