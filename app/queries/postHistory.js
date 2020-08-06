const { History } = require("../models/history");
const debug = require("debug")("blogWatcher:query");
require("dotenv").config();

/**
 *
 * @param {JSON} head_commit - Takes the req.body.head_commit from GH webooks
 */
const postHistory = async (head_commit) => {
	debug("Running postHistory");
	let history = new History();
	history.head_commit = head_commit;
	await history.save();
	debug("saved a new commit to history!");
};

module.exports = postHistory;
