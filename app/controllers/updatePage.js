const debug = require("debug")("blogWatcher:updatePage");
const updatePage = require("../queries/updatePageData.js");
require("dotenv").config();

// ? Heres an example of what the URL for this request looks like...
// ? Where aaabbbccc is the page ID ONLY (only supports updating by ID).
// ? Then pass an update query for the found document such as ?pageName=MyPage
// website.com/update/aaabbbccc?pageName=MyPage

const updatePageController = async (req, res) => {
	// ? uncomment for debugging
	debug("PARAMS:");
	debug(req.params);
	debug("BODY:");
	debug(req.body);

	const document = await updatePage(req.body.filter, req.body.update);
	debug(document);
	return res.status(200).json({ success: true, data: document });
};

module.exports = updatePageController;
