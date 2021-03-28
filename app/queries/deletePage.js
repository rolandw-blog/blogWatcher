const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:query");
const { promisify } = require("util");
require("dotenv").config();

const deletePagePromise = promisify(Page.findByIdAndDelete);

const deletePage = async (pageID) => {
	const { err, res } = await deletePagePromise(pageID)
	if (!err) return res;
		// if (!err) return res;
		// else return undefined;
	// })
	// return result;
};

module.exports = deletePage;
