const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:updatePage");
const updatePage = require("../queries/updatePageData.js");
require("dotenv").config();

/**
 * Takes a req.body.filter and req.body.update
 * Do not pass in the _id (no need to)
 * Will overwrite the _id if passed in with the _id parameter in the URL
 */
const deletePageController = async (req, res) => {
	debug("Updating a page...");

	// make sure or overwrite the _id if needed based on the url param
	req.body.filter._id = req.params._id;

	try {
		const result = await Page.remove(filter, update).exec();
		debug(result);
		return res.status(200).json(document);
	} catch (err) {
		const errorMessage = "Failed to delete field";
		res.status(500).json(errorMessage);
		return new Error(errorMessage);
	}

	// const document = await updatePage(req.body.filter, req.body.update);
	// return res.status(200).json(document);
};

module.exports = deletePageController;
