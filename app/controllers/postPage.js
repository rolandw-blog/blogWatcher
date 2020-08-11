const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../queries/findPage");
const yupPageSchema = require("../validation/pageSchema");
const postPageToDatabase = require("../queries/postPage");
const util = require("util");

const postPage = async (req, res) => {
	debug("Saving a new page");

	debug(req.body);

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
	if (Array.isArray(req.body.remote)) {
		for (i in req.body.remote) {
			source.push({
				remote: req.body.remote[i] == "true" ? true : false,
				url: req.body.url[i],
			});
		}
	} else {
		source.push({
			remote: req.body.remote == "true" ? true : false,
			url: req.body.url,
		});
	}

	const page = new Page({
		pageName: req.body.pageName,
		websitePath: req.body.websitePath,
		template: req.body.template,
		source: source,
	});

	const pageStatus = await postPageToDatabase(page);
	if (pageStatus != 200) {
		debug(`error ${pageStatus} saving the page`);
	} else {
		debug(`saved successfully: ${pageStatus}`);
	}

	res.status(200).json({ success: true });
};

module.exports = postPage;
