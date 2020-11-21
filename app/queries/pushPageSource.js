const debug = require("debug")("blogWatcher:pushPageHistC");
const { History } = require("../models/history");
const findPage = require("./findPage");
require("dotenv").config();

const pushPageHistory = async (_id, url, remote) => {
	debug("Running pushPageSource from db queries...");
	debug(`looking for ${_id}`);

	try {
		debug(`pushing history to ${_id}`);
		const page = await findPage("_id", _id);
		page.source.push({ url: url, remote: remote });
		page.save().then(() => {
			debug("saved success!");
			return true;
		});
	} catch (err) {
		debug(`ERROR async block failed ${err}`);
		return false;
	}
};

module.exports = pushPageHistory;
