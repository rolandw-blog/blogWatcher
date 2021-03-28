const getAllPages = require("../queries/getAllPages");
const countPages = require("../queries/countPages");

const getPages = async (req, res) => {
	// we are gonna use this to filter the query
	const filters = {};
	// queries for ?per_page and ?page
	const { page: pageNumber, per_page: perPage } = req.query;

	const pages = await getAllPages(filters, pageNumber, perPage);
	const count = await countPages();
	if (pages) {
		return res.status(200).json({
			count: count,
			page: pageNumber,
			perPage: perPage,
			data: pages,
		});
	} else {
		return res
			.status(500)
			.json({ success: false, error: "its dead jim! 🔨" });
	}
};

module.exports = getPages;
