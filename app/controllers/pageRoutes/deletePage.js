const debug = require("debug")("blogWatcher:deletePage");
// const deletePageQuery = require("../../queries/deletePage");
const { Page } = require("../../models/page");
const findPage = require("../../queries/pages/findPage")
const { promisify } = require("util");

// This will always return true regardless of if any page was deleted or not

const deletePageController = async (req, res) => {
	const pageID = req.params._id;

	try {
		Page.findByIdAndDelete(pageID, (err, result) => {
			if (err) {
				res.status(500).json({message: "Failed to delete page"});
			} else if (result) {
				res.status(200).json(result);
			} else {
				res.status(404).json({message: "No page found"});
			}
		});
	} catch (err) {
		// catch errors
		debug("catching error")
		return res.status(500).json({
			message: err,
		});
	}
};

module.exports = deletePageController;
