const getAllPages = require("../queries/getAllPages");
const countPages = require("../queries/countPages");
const debug = require("debug")("blogWatcher:getPagesC");

const getPages = async (req, res) => {
	// we are gonna use this to filter the query
	const filters = {};
	// queries for ?per_page and ?page
	const queries = req.query;

	const pages = await getAllPages(filters, queries);
	const count = await countPages();
	if (pages) {
		return res.status(200).json({ count: count, data: pages });
	} else {
		return res
			.status(400)
			.json({ success: false, error: "its dead jim! 🔨" })
	}
};

module.exports = getPages;
