const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../queries/findPage");
const yupPageSchema = require("../validation/pageSchema");
const postPageToDatabase = require("../queries/postPage");
const util = require("util");
const postPageHistory = require("../queries/pushPageHistory");
const updateLocalPathOfPage = require("../queries/updateLocalPathOfPage");
const {
	getBaseNameFromUrl,
	formatWebsitePath,
} = require("../build/URLConverter");

const postPage = async (req, res) => {
	debug(`Saving a new page:\t${req.body.pageName}`);

	// if multiple pages come through it looks like this:
	// blogwatcher |   blogWatcher:postPage   pageName: 'test2',
	// {
	// 	remote: [ 'true', 'true' ],
	// 	url: [ 'test1.com', 'test2.com' ]
	// }
	//
	// if one page comes through it wont be in an array
	// {
	// 	remote: 'true',
	// 	url: 'test.com'
	// }
	//
	// both are stored in an array,
	// IF its an array its pushed in an an object {remote, url}.
	// ELSE one object is pushed to source[0] and can be deconsutructed later
	// TODO If a local url is passed in here
	// TODO then its remote.url will point to the wrong place
	// TODO E.G /localContent/test.md will be saved as /localContent/test.md
	// TODO when it should really be saved as /localContent/5f36713524f4a368d7e2117c
	// TODO wrote a query for updating the url after it has been posted
	// TODO and check each source after its been posted (see below todo comment)
	// ! The only manual fix for ^ is to just post the page and then change its source
	// ! To something like /localContent/5f36713524f4a368d7e2117c_0.md
	const source = [];
	if (Array.isArray(req.body.source)) {
		debug("parsing array of sources");
		for (i in req.body.remote) {
			source.push({
				remote: req.body.remote[i] == "true" ? true : false,
				url: req.body.url[i],
			});
		}
	} else if (req.body.url) {
		debug("parsing single source");
		source.push({
			remote: req.body.remote == "true" ? true : false,
			url: req.body.url,
		});
	} else {
		debug("no source information provided");
	}

	// if the autoName is true then guess the name from the first url
	let pageName = req.body.pageName;
	debug(`autoname: ${req.body.autoName}`);
	if (req.body.autoName == "true") {
		pageName = getBaseNameFromUrl(source[0].url);
		debug(`autoname renamed pageName to "${pageName}"`);
	}

	// Create a page object using the above information
	const page = new Page({
		pageName: pageName,
		hidden: req.body.hidden || false,
		websitePath: formatWebsitePath(req.body.websitePath),
		meta: {
			template: req.body.template,
		},
		source: source,
	});

	// debug("attempting to post");
	// debug(page);

	const postedPage = await postPageToDatabase(page);
	if (postedPage.status != 200) {
		debug(`error ${postedPage.status} saving the page`);
		return res.status(postedPage.status).json({ success: false });
	} else {
		debug(`saved successfully: ${postedPage.status}`);
		historyDoc = {
			timestamp: new Date(),
			message: "Page was created",
		};
		postPageHistory(postedPage.page.pageName, historyDoc);
		// TODO read above todo
	}

	res.status(200).json(postedPage.page);
};

module.exports = postPage;
