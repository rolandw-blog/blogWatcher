const findPage = require("../../queries/pages/findPage");
const debug = require("debug")("blogWatcher:getPage");

// ? The url needs to be formed with params:
// ? example.com/page?pageName=${pageName}
// ? example.com/page?_id=${_id}
// ? example.com/page?websitePath=${websitePath}
const getPage = async (req, res) => {
	let key = "_id";
	let query = {};

	const pageNumber = req.query.page;
	const perPage = req.query.per_page;

	if (req.query._id) {
		let key = "_id";
		query = { _id: req.query._id };
	}

	if (req.query.websitePath) {
		key = "websitePath";

		// the websitePath within the database is an ARRAY.
		// so we take an array like ["hello", "world"] and turn it into an object for mongoose
		// like {"websitePath.0": "hello", "websitePath.1": "world"} to match against the arrays contents
		let temp = {};

		// construct an array from the website filepath given
		const arr =
			req.query.websitePath !== "/"
				? req.query.websitePath.split("/").filter(String)
				: [];

		// create the object for the query: {"websitePath.0": "hello", "websitePath.1": "world"}
		for (let i = 0; i < arr.length; i++) {
			temp[`websitePath.${i}`] = arr[i];
		}

		// ##──── drillLayers ───────────────────────────────────────────────────────────────────────
		// By default, we ONLY pass back the page if its an EXACT match (level="$eq"), however, with the &level query this can be changed to a range (level="$gte")
		// =====================================================================================================================
		// In the following situation:
		// /notes
		// /notes/linux
		// /notes/networking
		// /notes/linux/printers
		// =====================================================================================================================
		// /page?websitePath=/notes => returns /notes
		// /page?websitePath=/notes&level=1 => returns /notes, and /notes/networking (level 1 = neighbors)
		// /page?websitePath=/notes&level=2 => returns /notes, and /notes/networking (level 2 = neighbors and neighbors children)

		// If we give no level, then the returned path will match the exact website path (the length of the array of the passed websitePath)
		// If we give it a level, then we use "$gte" and the number of levels parsed in the query to get siblings(by adding the level to the array length of the websitePath)
		const drillLayers =
			arr.length + parseInt(req.query.level) || arr.length;

		// By default we will match the path EXACTLY
		let level = "$eq";

		// If a level is given, then the range web websitePath will change from EQ to GTE because we now want a range, not an exact match
		if (req.query.level) {
			level = "$gte";
		}

		query = {
			...query,
			...temp,
			websitePathLength: { [level]: drillLayers, $lt: drillLayers + 1 },
		};
		// console.log(query)
	}

	if (req.query.pageName) {
		query = { pageName: req.query.pageName };
	}

	const pages = await findPage(query, pageNumber, perPage);
	console.log(`${pages.length} pages`);

	if (pages) return res.status(200).json(pages);
	else return res.status(400).json({ success: false, error: pages });
};

module.exports = getPage;
