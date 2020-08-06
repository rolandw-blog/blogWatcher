const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");

const postPage = async (req, res) => {
	debug("Saving a new page");

	// ! this was a validator but im gonna use happi/joi eventually so...
	// if (!pageName || !type || !path) {
	// 	return res
	// 		.status(422)
	// 		.json({ success: false, error: "u didnt include enough info" });
	// }

	let page = new Page();

	page.pageName = "a";
	page.source.remote = req.body.remote;
	page.source.path = req.body.path;
	page.websitePath = req.body.websitePath;
	page.meta.template = req.body.template;

	page.save().then((doc) => {
		debug(`Saved ${doc._id}`);
	});
	res.status(200).json({ success: true });
};

module.exports = postPage;
