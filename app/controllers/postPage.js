const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../queries/findPage");
const yupPageSchema = require("../validation/pageSchema");
const util = require("util");

const postPage = async (req, res) => {
	debug("Saving a new page");

	let page = new Page();
	page.pageName = req.body.pageName;
	page.source.remote = req.body.remote;
	page.source.path = req.body.path;
	page.websitePath = req.body.websitePath;
	page.meta.template = req.body.template;

	// check its a valid page against the yup schema
	// TODO clean up this spaghetti
	try {
		const isValid = await yupPageSchema.validate(page);
	} catch (err) {
		debug(`error: ${err.name}`);
		debug(err.errors);
		return res.status(400).send("validation error");
	}

	if (!(await findPage(page.pageName))) {
		page.save().then((doc) => {
			debug(`Saved ${doc._id}`);
		});
	} else {
		debug(`the page ${page.pageName} already exists`);
		return res.status(409).send("record already exists");
	}

	res.status(200).json({ success: true });
};

module.exports = postPage;
