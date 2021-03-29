const debug = require("debug")("blogWatcher:updatePage");
const updatePage = require("../../../queries/pages/updatePageData.js");
require("dotenv").config();

// Controller endpoint for updating a field in a page document
// THIS DOES NOT APPEND TO page.source (history), use addPageSource.js instead

/**
 * Takes a req.body.filter and req.body.update
 */
const updatePageController = async (req, res) => {
	debug("Updating a page...");

	// update the page
	const document = await updatePage(req.body.filter, req.body.update);
	return res.status(200).json(document);
};

module.exports = updatePageController;
