const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
const mongoose = require("mongoose");
require("dotenv").config();

/** Return the number of items that need to be skipped
 * to get to page number
 * @param {number} page - The queries.page value (?page=N)
 * @param {number} per_page - The queries.per_page value (?per_page=N)
 * @returns The number of images to be skipped.
 */
const getSkipCount = (page, per_page) => {
	// get the per_page query and convert it to a number to set the numberOfItemsPerPage
	per_page = Number(per_page);
	debug(`page number: ${page}`);
	debug(`per page number: ${per_page}`);

	// Set the number of items per page to the ?per_page=n if its between 10 and 100
	const numberOfItemsPerPage =
		per_page && per_page >= 1 && per_page <= 100 ? per_page : 100;

	//get the page number and convert it to a number
	const pageNumber = Number(page) || 0;

	// Internally controlls how many values to skip to give the illusion of pages
	const skipCount = pageNumber ? numberOfItemsPerPage * pageNumber : 0;

	debug(
		`Internally skipping ${skipCount} results to get to page ${pageNumber}`
	);

	return skipCount;
};

/** Sanitizes the per_page query to return the number of items available per page,
 * or the maximum number of items which can be returned on a page (Capped at 999)
 * @param {number} per_page - The number of items available per page
 * @returns The number of items available per page
 */
const getPerPage = (per_page) => {
	per_page = Number(per_page);
	if (per_page <= 999) {
		return per_page;
	} else {
		return 999;
	}
};

// * get all pages in the database
/** Returns a promise that resolves to an array of pages
 * or undefined if not found
 * @example
 * getAllPages({});
 * @example
 * getAllPages({pageName: "home"});
 */
const getAllPages = async (filters, queries = {}) => {
	debug("Running getAllPages from db queries...");

	// only return pages that should be built
	filters = {
		...filters,
		hidden: false,
	};

	debug(filters);

	// Internally controlls how many values to skip to give the illusion of pages
	const skipCount = getSkipCount(queries.page, queries.per_page);

	// ##──── Queries ───────────────────────────────────────────────────────────────────────────
	// how many items per page - ?per_page
	const per_page = getPerPage(queries.per_page);

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
