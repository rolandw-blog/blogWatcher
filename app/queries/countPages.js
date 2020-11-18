const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query_count");
require("dotenv").config();

const findHistory = async (filter = {}) => {
	try {
		debug(`Counting all pages`);
		if (Object.keys(filter).length !== 0) debug(filter);
		return Page.countDocuments((err, count) => {
			if (err) {
				debug(`ERROR retrieving history: ${err}`);
				return undefined;
			}

			if (!Number.isInteger(count)) {
				debug("count wasnt a number");
				return undefined;
			}

			debug(`Counted ${count} pages`);
			return count;
		});
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = findHistory;
