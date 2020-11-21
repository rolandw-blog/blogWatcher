const debug = require("debug")("blogWatcher:addPageSource");
const postHistory = require("../queries/postHistory");
const findPage = require("../queries/findPage");
const updatePage = require("../queries/updatePageData.js");
const pushPageSource = require("../queries/pushPageSource");
const yup = require("yup");
const path = require("path");

// source should look like
// {
// 	remote: bool,
// 	url: string
// }

const buildPages = async (req, res) => {
	debug("adding page source");
	debug(req.body);
	const { _id } = req.body;
	const url = req.body.url;
	const remote = req.body.remote;

	// see if this pages exists in our existing "pages" db
	debug(`searching for page "${_id}"`);
	const page = await findPage("_id", _id);

	// if it exists then push this commit to its history
	if (page) {
		debug(`updating the page:`);
		debug(page);
		// if theres a page then add the source...
		await pushPageSource(_id, url, remote);

		// increment the revision number for the page
		const filter = { _id: page._id };
		const update = { __v: (page.__v += 1) };
		await updatePage(filter, update);
	} else {
		debug("no page found");
	}
};

module.exports = buildPages;
