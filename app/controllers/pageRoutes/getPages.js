const getAllPages = require("../../queries/pages/getAllPages");
const countPages = require("../../queries/pages/countPages");

const getPages = async (req, res) => {
	// we are gonna use this to filter the query
	const filters = {};

	// queries for ?per_page and ?page
	const { page: pageNumber, per_page: perPage } = req.query;

	// get the pages
	const pages = await getAllPages(filters, pageNumber, perPage);

	// count all the pages
	const count = await countPages();

	// return the data
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
