const { Page } = require("../../models/page");
const debug = require("debug")("blogWatcher:query_count");
require("dotenv").config();

const countPages = async (filter = {}) => {
	try {
		if (Object.keys(filter).length !== 0) debug(filter);
		return Page.countDocuments((err, count) => {
			if (err) {
				debug(err);
				return undefined;
			}

			if (!Number.isInteger(count)) {
				debug("count wasn't a number");
				return undefined;
			}

			return count;
		});
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = countPages;
