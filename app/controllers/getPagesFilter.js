const getAllPages = require("../queries/getAllPages");
const countPages = require("../queries/countPages");
const debug = require("debug")("blogWatcher:getPagesC");

const getPagesFilter = async (req, res) => {
	// we are gonna use this to filter the query
	const validFilters = [
		"source.url",
		"source.remote",
		"meta.template",
		"pageName",
		"__v",
		"hidden",
		"websitePath",
	];

	// only perform a filter if its a type that we can typecast to regex (IE. Not an _id)
	let filter = {};
	if (validFilters.includes(req.params.filter)) {
		filter = { [req.params.filter]: new RegExp(req.params.value) };
	} else {
		// if we cant regex it (IE. make it fuzzy) then we can at least search for the complete string
		filter = { [req.params.filter]: req.params.value };
	}

	// queries for ?per_page and ?page
	const queries = req.query;

	const pages = await getAllPages(filter, queries);
	const count = await countPages(filter);

	if (pages) {
		return res.status(200).json({ count: count, data: pages });
	} else {
		return res
			.status(400)
			.json({ success: false, error: "its dead jim! 🔨" });
	}

	// // check that BS isnt being passed in
	// if (req.query.websitePath) filters.websitePath = req.query.websitePath;
	// if (req.query.regex)
	// 	filters.websitePath = new RegExp(req.query.websitePath);
	// // ? add more stuff...

	// debug(`getting pages using the filter: "${JSON.stringify(filters)}"`);
	// const pages = await getAllPages(filters, queries);
	// const count = await countPages();
	// if (pages) return res.status(200).json({ count: count, data: pages });
	// else
	// 	return res
	// 		.status(400)
	// 		.json({ success: false, error: "its dead jim! 🔨" });
};

module.exports = getPagesFilter;
