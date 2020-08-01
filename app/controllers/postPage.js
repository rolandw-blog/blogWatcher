const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");

const postPage = async (req, res) => {
	debug("Saving a new page");

	const pageName = req.body.pageName;
	const type = req.body.type;
	const path = req.body.path;
	const fsPath = req.body.fsPath;
	const template = req.body.template;

	if (!pageName || !type || !path) {
		return res
			.status(422)
			.json({ success: false, error: "u didnt include enough info" });
	}

	const page = new Page({
		pageName: pageName,
		pageSource: {
			type: type,
			path: path,
		},
		fsPath: fsPath,
		template: template,
	});

	page.save().then((doc) => {
		debug(`Saved ${doc._id}`);
	});
	res.status(200).json({ success: true });
};

module.exports = postPage;
