const debug = require("debug")("blogWatcher:deletePage");
// const deletePageQuery = require("../../queries/deletePage");
const { Page } = require("../../models/page");
const findPage = require("../../queries/pages/findPage");
const { promisify } = require("util");
const countPages = require("../../queries/pages/countPages");

// This will always return true regardless of if any page was deleted or not

const countPagesController = async (req, res) => {
	const pageID = req.params._id;

	try {
		const count = await countPages();
		res.status(200).json({ count });
	} catch (err) {
		// catch errors
		debug("catching error");
		return res.status(500).json({
			message: err,
		});
	}
};

module.exports = countPagesController;
