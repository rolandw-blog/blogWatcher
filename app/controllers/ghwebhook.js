// const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:ghWebHook");

const secret = process.env.GITHUB_SECRET;
const sigHeaderName = "x-Hub-Signature";

const buildPages = async (req, res) => {
	// TODO make an event emitter to .on("progress") and send data back to the client
	// debug(req.body);

	res.status(200).json({ success: true });
	// .send("success!");
};

module.exports = buildPages;
