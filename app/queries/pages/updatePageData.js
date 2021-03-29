const { Page } = require("../../models/page");
const debug = require("debug")("blogWatcher:query");
const util = require("util");
require("dotenv").config();

const updatePageDate = async (filter, update) => {
	debug("Running update page data from db queries...");
	debug("updating where:...");
	debug({ filter, update });

	// find the page by its filter {_id: aaabbbccc} and then update {somefiled: newvalue}
	try {
		return Page.findOneAndUpdate(filter, update, (err, doc) => {
			if (err) throw new Error(err);
			else return doc;
		})
	} catch (err) {
		return new Error("Failed to update page somehow");
	}
};

module.exports = updatePageDate;
