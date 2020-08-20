const getAllPages = require("../queries/getAllPages");
const debug = require("debug")("blogWatcher:getPagesC");

const getPage = async (req, res) => {
	// we are gonna use this to filter the query
	const filters = {};

	// check that BS isnt being passed in
	if (req.query.websitePath) filters.websitePath = req.query.websitePath;
	// if (req.query.websitePath) filters.websitePath = req.query.websitePath;
	// if (req.query.websitePath) filters.websitePath = req.query.websitePath;
	// ? add more stuff...

	const pages = await getAllPages(filters);

	if (pages) return res.status(200).json(pages);
	else
		return res
			.status(400)
			.json({ success: false, error: "its dead jim! 🔨" });
};

module.exports = getPage;
