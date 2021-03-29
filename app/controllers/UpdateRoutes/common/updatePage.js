const debug = require("debug")("blogWatcher:updatePage");
const updatePage = require("../../../queries/pages/updatePageData.js");
require("dotenv").config();

/**
 * Takes a req.body.filter and req.body.update
 */
const updatePageController = async (req, res) => {
	debug("Updating a page...");

	// update the page
	const document = await updatePage(req.body.filter, req.body.update);
	if (!document) return res.status(400).json({message: "document was not found"});
	else res.status(200).json(document);
};

module.exports = updatePageController;
