const { History } = require("../models/history");
const debug = require("debug")("blogWatcher:query_history");
require("dotenv").config();

const findHistory = async (pageID) => {
	debug("Running findHistory from db queries...");
	try {
		debug(`looking for history for the page ID: ${pageID}`);
		return History.find({ for: pageID }, "", (err, historyArray) => {
			if (err) {
				debug(`ERROR retrieving history: ${err}`);
				return undefined;
			}

			if (historyArray.length == 0) {
				debug("no history found");
				return undefined;
			}

			debug(
				`Found ${historyArray.length} history items for page ${pageID}`
			);
			return historyArray;
		});
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = findHistory;
