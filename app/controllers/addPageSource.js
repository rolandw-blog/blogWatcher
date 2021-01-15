const debug = require("debug")("blogWatcher:addPageSource");
const postHistory = require("../queries/postHistory");
const findPage = require("../queries/findPage");
const updatePage = require("../queries/updatePageData.js");
const yup = require("yup");
const path = require("path");

/**
 *
 * source should look like this
 * {
 * 	remote: bool,
 * 	url: string
 * }
 *
 */
const addPageSource = async (req, res) => {
	debug("adding page source");
	const { _id } = req.params;
	const url = req.body.url;
	const remote = req.body.remote;

	// see if this pages exists in our existing "pages" db
	const page = await findPage("_id", _id);

	// if it exists then push this commit to its history
	if (page) {
		debug(`updating the page: ${page._id}`);

		// add the source
		await page.source.push({ url: url, remote: remote });

		// save the page back again
		await page.save().then((doc) => {
			debug("saved success!");
			debug(doc);
			res.status(200).json(doc);
		});

		// increment the revision number for the page
		const filter = { _id: page._id };
		const update = { __v: (page.__v += 1) };
		await updatePage(filter, update);

		// add a history item for this page
		const head_commit = {
			message: `Added new URL`,
			timestamp: new Date().toISOString(),
			modified: [],
			committer: {
				name: "RolandWarburton",
				email: "warburtonroland@gmail.com",
				username: "RolandWarburton",
			},
		};
		postHistory(page, head_commit);
	} else {
		debug("no page found");
	}
};

module.exports = addPageSource;
