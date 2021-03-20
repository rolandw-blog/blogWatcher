const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
const util = require("util");
require("dotenv").config();

const updatePageDate = async (filter, update) => {
	debug("Running update page data from db queries...");
	debug("updating where:...");
	debug({ filter, update });

	// find the page by its filter {_id: aaabbbccc} and then delete it {somefiled: newvalue}
	try {
		const result = await Page.remove(filter, update).exec();
		debug(result);
		return result;
	} catch (err) {
		return new Error("Failed to delete field");
	}
};

module.exports = updatePageDate;
