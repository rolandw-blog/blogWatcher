const debug = require("debug")("blogWatcher:updatePage");
const updatePage = require("../queries/updatePageData.js");
require("dotenv").config();

// Controller endpoint for updating a field in a page document
// THIS DOES NOT APPEND TO page.source (history), use addPageSource.js instead

/**
 * Takes a req.body.filter and req.body.update
 * Do not pass in the _id (no need to)
 * Will overwrite the _id if passed in with the _id parameter in the URL
 */
const updatePageController = async (req, res) => {
	debug("Updating a page...");

	// make sure or overwrite the _id if needed based on the url param
	req.body.filter._id = req.params._id;

	const document = await updatePage(req.body.filter, req.body.update);
	return res.status(200).json(document);
};

module.exports = updatePageController;
