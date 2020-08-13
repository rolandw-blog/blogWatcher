// const { Page } = require("../models/page");
const findPage = require("../queries/findPage");
const debug = require("debug")("blogWatcher:postPage");

const getPage = async (req, res) => {
	const page = await findPage("_id", req.params.id);

	// debug(req.params.id);

	if (page) return res.status(200).json(page);
	else return res.status(400).json({ success: false, error: page });

	// return res.status(200).json({});
};

module.exports = getPage;
