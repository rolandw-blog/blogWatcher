const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../queries/findPage");
const postPageToDatabase = require("../queries/postPage");
const postHistory = require("../queries/postHistory");
const {
	getBaseNameFromUrl,
	formatWebsitePath,
} = require("../build/URLConverter");

// {
//     "pageName": "testPage",
//     "source": [{"remote": true, "url": "a.com"}],
//     "websitePath": "/deleteMe",
//     "hidden": false,
//     "meta": {"template": "blogPost.ejs"}
// }

const postPage = async (req, res) => {
	debug(req.body);
	debug(`Saving a new page:\t${req.body.pageName}`);
	const { pageName, source, websitePath, hidden, meta } = req.body;

	const existingPageName = await findPage("pageName", pageName);
	const existingWebsitePath = await findPage("websitePath", websitePath);
	if (existingPageName || existingWebsitePath) {
		return res
			.status(400)
			.json({ success: false, message: "page already exists" });
	}

	// Create a page object using the above information
	const page = new Page({
		pageName: pageName,
		source: source,
		hidden: hidden,
		websitePath: websitePath,
		meta: meta,
	});

	// then save it
	page.save().then((doc) => {
		// then post hsitory that marks the pages creation
		const historyData = {
			message: "page was created",
			timestamp: new Date().toISOString(),
			modified: pageName,
			committer: {
				name: "RolandWarburton",
				email: "warburtonroland@gmail.com",
				username: "RolandWarburton",
			},
		};
		postHistory(page, historyData).then(() => {
			// finally return the document
			return res.status(200).json(doc);
		});
	});
};

module.exports = postPage;
