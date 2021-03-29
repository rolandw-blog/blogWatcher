const debug = require("debug")("blogWatcher:query");

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

	// Internally control's how many values to skip to give the illusion of pages
	const skipCount = pageNumber ? numberOfItemsPerPage * pageNumber : 0;

	debug(
		`Internally skipping ${skipCount} results to get to page ${pageNumber}`
	);

	return skipCount;
};

module.exports = getSkipCount;
