const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
require("dotenv").config();

const updatePageDate = async (filter, update) => {
	debug("Running update page data from db queries...");
	debug("updating where:...");
	debug({ filter, update });

	// find the page by its filter {_id: aaabbbccc} and then update {somefiled: newvalue}
	return await Page.findOneAndUpdate(filter, update, (err, result) => {
		if (err) {
			debug("an error happened :O");
			debug(err);
			return undefined;
		} else {
			debug(`saved document`);
			return result;
		}
	});
};

module.exports = updatePageDate;
