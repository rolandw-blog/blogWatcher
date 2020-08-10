const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../queries/findPage");
const yupPageSchema = require("../validation/pageSchema");
const postPageToDatabase = require("../queries/postPage");
const util = require("util");

const postPage = async (req, res) => {
	debug("Saving a new page");

	let page = new Page();
	page.pageName = req.body.pageName;
	page.source.remote = req.body.remote;
	page.source.path = req.body.path;
	page.websitePath = req.body.websitePath;
	page.meta.template = req.body.template;

	const pageStatus = await postPageToDatabase(page);
	if (pageStatus != 200) {
		debug(`error ${pageStatus} saving the page`);
	} else {
		debug(`saved successfully: ${pageStatus}`);
	}

	res.status(200).json({ success: true });
};

module.exports = postPage;
