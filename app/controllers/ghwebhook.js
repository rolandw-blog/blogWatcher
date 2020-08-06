// const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:ghWebHook");
const postHistory = require("../queries/postHistory");
const yup = require("yup");

const buildPages = async (req, res) => {
	// TODO make an event emitter to .on("progress") and send data back to the client
	// debug(req.body);

	const commit = JSON.stringify(req.body.head_commit);
	debug(commit);

	// tell github that its all good!
	res.status(200).json({ success: true });

	// start saving the head_commit to the database
	debug("Posting new commit to history database");
	await postHistory(commit);
};

module.exports = buildPages;
