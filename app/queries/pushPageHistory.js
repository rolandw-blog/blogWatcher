const debug = require("debug")("blogWatcher:pushPageHistC");
const findPage = require("./findPage");
require("dotenv").config();

/**
 * Push a commit head to a blogWatcher.page document
 * @param {String} pageName - The name of the page
 * @param {String} history - The req.body.head_commit from GH webhooks as a JSON string
 */
const pushPageHistory = async (pageName, history) => {
	debug("Running pushPageHistory from db queries...");
	debug(`looking for ${pageName}`);

	try {
		historyDoc = {
			timestamp: history.timestamp,
			message: history.message,
			committer: {
				name: "RolandWarburton",
				email: "warburtonroland@gmail.com",
				username: "RolandWarburton",
			},
		};

		debug(`pushing history to ${pageName}`);
		const page = await findPage("pageName", pageName);
		page.meta.history.push(historyDoc);
		page.save().then(() => debug("saved success!"));
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = pushPageHistory;
