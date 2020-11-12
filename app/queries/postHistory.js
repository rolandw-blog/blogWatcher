const { History } = require("../models/history");
const debug = require("debug")("blogWatcher:query");
require("dotenv").config();

/**
 * Push a commit head to the blogWatcher.history collection
 * @param {JSON} head_commit - Takes the req.body.head_commit from GH webooks
 */
const postHistory = async (page, head_commit) => {
	debug("Running postHistory");
	const commit = head_commit;
	const historyData = {
		message: commit.message,
		timestamp: commit.timestamp,
		modified: commit.modified,
		committer: commit.committer,
	};
	let history = new History({ for: page._id, data: historyData });

	await history.save().then((doc) => {
		debug(`saved a new commit to history!`);
		debug(doc);
	});
	return historyData;
};

module.exports = postHistory;
