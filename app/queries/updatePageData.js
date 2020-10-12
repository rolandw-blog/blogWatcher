const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:queryUpdatePathOfPage");
require("dotenv").config();

const updatePageDate = async (filter, update) => {
	debug("Running update page data from db queries...");

	// find the page by its filter {_id: aaabbbccc} and then update {somefiled: newvalue}
	return await Page.findOneAndUpdate(filter, update, (err, result) => {
		if (err) {
			debug("an error happened :O");
			debug(err);
			return undefined;
		} else {
			debug(`saved document`);
			return result._doc;
		}
	});
};

module.exports = updatePageDate;
