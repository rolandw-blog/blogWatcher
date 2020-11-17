const debug = require("debug")("blogWatcher:updatePage");
const updatePage = require("../queries/updatePageData.js");
require("dotenv").config();

// ? Heres an example of what the URL for this request looks like...
// ? Where aaabbbccc is the page ID ONLY (only supports updating by ID).
// ? Then pass an update query for the found document such as ?pageName=MyPage
// website.com/update/aaabbbccc?pageName=MyPage

const updatePageController = async (req, res) => {
	// ? uncomment for debugging
	// ID of the page. EG: aaabbbccc
	// debug("reading id from params");
	const _id = req.params.id;

	// ? uncomment for debugging
	// debug("PARAMS:");
	// debug(req.params);
	// debug("QUERY:");
	// debug(req.query);
	// debug("BODY:");
	// debug(req.body);

	// The query against the database to find the document we want to update
	// id comes from the :id param of the url
	// ! Query only supports ID
	let filter = {};

	// The {key: value} for the document that needs to be updated
	let update = {};

	// make sure a query was passed
	if (!req.query)
		return res.status(422).json({
			success: false,
			message: "query required in the form of ?oldValue=newValue",
		});

	// Extract the key and value from the query to create the "update" request json...
	// The server needs to extract these as seperate values without knowing the keys name
	// Example input: {websitePath: "testtt"}

	// step 1 is to get the keys name
	const key = Object.keys(req.query)[0];
	debug(`Key: ${key}`);

	// step 2 is to get the value from this key
	const val = req.query[key];
	console.log(`Key: ${val}`);

	// step 3 is to decode the URI value
	const decodedVal = decodeURIComponent(val);
	console.log(`DecodedVal: ${decodedVal}`);

	// create the filter query and update object
	// For example
	// filter = {_id: aaabbbccc}
	// update = {pageName: "newPageName"}
	filter._id = _id;
	update[key] = decodedVal;

	// make an exception for urls which need to be buried under source.url
	if (key == "url") update = { source: { update } };

	// ? uncomment for debugging
	// debug("FILTER:");
	// debug(filter);
	// debug("UPDATE:");
	// debug(update);

	// debug("ok. updating the page now...");
	// Update the page by passing it the filter to determine WHAT to update
	// and the update which tells it WHICh field to change and what it should be changed to
	const document = await updatePage(filter, update);

	// updatePage should return the updated document if successful
	if (document) {
		return res.status(200).json(document);
	} else {
		// if the document returned undefined then something went wrong
		return res.status(500).json({
			success: false,
			message: "Something went wrong updating the page",
			info: {
				filter: filter,
				update: update,
				params: req.params,
				query: req.query,
			},
		});
	}
};

module.exports = updatePageController;
