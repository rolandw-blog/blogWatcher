const { History } = require("../models/history");
const debug = require("debug")("blogWatcher:query");
require("dotenv").config();

/**
 * Push a commit head to the blogWatcher.history collection
 * @param {JSON} head_commit - Takes the req.body.head_commit from GH webooks
 */
const postHistory = async (head_commit) => {
	debug("Running postHistory");
	const commit = JSON.parse(head_commit);
	const historyData = {
		message: commit.message,
		timestamp: commit.timestamp,
		modified: commit.modified,
		committer: commit.committer,
	};
	let history = new History(historyData);
	await history.save().then((doc) => debug(`saved a new commit to history!`));
	return historyData;
};

module.exports = postHistory;
