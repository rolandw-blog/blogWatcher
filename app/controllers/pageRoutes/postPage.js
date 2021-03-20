const { Page } = require("../../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../../queries/findPage");
const postHistory = require("../../queries/postHistory");

// ? example post data
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

	debug("looking for existing page by its name");
	const existingPageName = await findPage("pageName", pageName);
	debug("looking for an existing page by its websitePath");
	const existingWebsitePath = await findPage("websitePath", websitePath);
	if (existingPageName || existingWebsitePath) {
		debug("the page already existed");
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
	debug("created a new page object");

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
