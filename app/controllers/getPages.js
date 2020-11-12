const getAllPages = require("../queries/getAllPages");
const debug = require("debug")("blogWatcher:getPagesC");

const getPages = async (req, res) => {
	// we are gonna use this to filter the query
	const filters = {};
	// queries for ?per_page etc
	const queries = req.query;

	// check that BS isnt being passed in
	if (req.query.websitePath) filters.websitePath = req.query.websitePath;
	if (req.query.regex)
		filters.websitePath = new RegExp(req.query.websitePath);
	// ? add more stuff...

	debug(`getting pages using the filter: "${JSON.stringify(filters)}"`);
	const pages = await getAllPages(filters, queries);

	if (pages) return res.status(200).json(pages);
	else
		return res
			.status(400)
			.json({ success: false, error: "its dead jim! 🔨" });
};

module.exports = getPages;
