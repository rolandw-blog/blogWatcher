const { History } = require("../../models/history");
const debug = require("debug")("app");
require("dotenv").config();

const findHistory = async (pageID) => {
	debug("Running findHistory from db queries...");
	try {
		return History.find({ for: pageID }, "", (err, historyArray) => {
			if (err) {
				debug(`ERROR retrieving history: ${err}`);
				return undefined;
			}

			if (historyArray.length == 0) {
				debug("no history found");
				return undefined;
			}
			return historyArray;
		});
	} catch (err) {
		return debug(`ERROR async block failed ${err}`);
	}
};

module.exports = findHistory;
