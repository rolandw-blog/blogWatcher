const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
const findPage = require("./findPage");
require("dotenv").config();

/**
 * Push a commit head to a blogWatcher.page document
 * @param {String} pageName - The name of the page
 * @param {String} history - The req.body.head_commit from GH webhooks as a JSON string
 */
const pushPageHistory = async (pageName, history) => {
	debug("Running findPage from db queries...");
	try {
		const page = await findPage("pageName", pageName);
		debug(`pushed history to ${pageName}`);
		page.meta.history.push(history);
		page.save().then(() => debug("saved success!"));
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = pushPageHistory;
