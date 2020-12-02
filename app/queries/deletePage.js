const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
const pageSchema = require("../validation/pageSchema");
const findPage = require("./findPage");
require("dotenv").config();

const postPage = async (pageID) => {
	// try {
	return Page.findByIdAndDelete(pageID, (err) => {
		if (!err) {
			debug("page delete success");
			return true;
		}
		debug("page delete failed" + err);
		return false;
	});
	// } catch (err) {
	// 	debug(`ERROR async block failed ${err}`);
	// 	return false;
	// }
};

module.exports = postPage;
