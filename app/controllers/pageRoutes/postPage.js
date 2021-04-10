const { Page } = require("../../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../../queries/pages/findPage");
const postHistory = require("../../queries/history/postHistory");

// ? example post data
// {
//     "pageName": "testPage",
//     "source": [{"remote": true, "url": "a.com"}],
//     "websitePath": ["deleteMe"],
//     "hidden": false,
//     "meta": {"template": "blogPost.ejs"}
// }

const postPage = async (req, res) => {
	debug(`Saving a new page: ${req.body.pageName}`);
	const { pageName, source, websitePath, hidden, meta } = req.body;

	// fetch any pages based on the name
	const existingPageName = await findPage({ pageName: pageName });

	// fetch any pages based on the path
	const existingWebsitePath = await findPage({ websitePath: websitePath });

	// if either of the above pages exist, then the new page would be a duplicate
	let error = [];
	if (existingPageName[0]) error.push("Page name existed already");
	if (existingWebsitePath[0]) error.push(`Page already exists at that path`);
	if (error.length !== 0) {
		console.error(`Page cannot be created because ${error.join(", and ")}`);
		return res.status(400).json({ success: false, error });
	}

	try {
		// Create a page object using the above information
		const newPage = await new Page({
			pageName: pageName,
			source: source,
			hidden: hidden,
			websitePath: websitePath.split("/"),
			websitePathLength: websitePath.split("/").length,
			meta: meta,
		}).save();

		// print out the new page
		debug("Saved a new page:");
		debug({ newPage });

		// then post hsitory that marks the pages creation
		await postHistory(newPage, {
			message: "page was created",
			timestamp: new Date().toISOString(),
			modified: pageName,
			committer: {
				name: "RolandWarburton",
				email: "warburtonroland@gmail.com",
				username: "RolandWarburton",
			},
		});

		// finally return the document
		return res.status(200).json(newPage);
	} catch (err) {
		return res.status(500).json({ err });
	}
};

module.exports = postPage;
