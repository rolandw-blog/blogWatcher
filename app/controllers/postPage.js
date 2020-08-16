const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../queries/findPage");
const yupPageSchema = require("../validation/pageSchema");
const postPageToDatabase = require("../queries/postPage");
const { getBaseNameFromUrl } = require("../build/URLConverter");
const util = require("util");

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
	const pageName =
		req.body.autoName == true
			? getBaseNameFromUrl(source[0].url)
			: req.body.pageName;

	// Create a page object using the above information
	const page = new Page({
		pageName: pageName,
		websitePath: req.body.websitePath,
		meta: {
			template: req.body.template,
		},
		source: source,
	});

	debug("attempting to post");
	debug(page);

	const pageStatus = await postPageToDatabase(page);
	if (pageStatus != 200) {
		debug(`error ${pageStatus} saving the page`);
		return res.status(pageStatus).json({ success: false });
	} else {
		debug(`saved successfully: ${pageStatus}`);
	}

	res.status(200).json(page);
};

module.exports = postPage;
