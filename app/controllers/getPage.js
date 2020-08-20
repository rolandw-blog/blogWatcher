// const { Page } = require("../models/page");
const findPage = require("../queries/findPage");
const debug = require("debug")("blogWatcher:getPage");

const getPage = async (req, res) => {
	debug(`page requested for ${JSON.stringify(req.query)}`);
	let key = "_id";
	let value = "";

	if (req.query.id) {
		key = "_id";
		value = req.query.id;
	}
	if (req.query.websitePath) {
		key = "websitePath";
		value = req.query.websitePath;
	}
	if (req.query.pageName) {
		key = "pageName";
		value = req.query.pageName;
	}

	const page = await findPage(key, value);
	// const page = await findPage("_id", req.params.id);

	// debug(req.params.id);

	if (page) return res.status(200).json(page);
	else return res.status(400).json({ success: false, error: page });

	// return res.status(200).json({});
};

module.exports = getPage;
