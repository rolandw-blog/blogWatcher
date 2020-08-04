// Returns JSON structure of what the website will look like based on the database of sources
const debug = require("debug")("blogWatcher:previewSiteLayout");
const getAllPages = require("../queries/getAllPages");
const { json } = require("express");

const previewSiteLayout = async () => {
	debug("running previewSiteLayout");
	const pages = await getAllPages();
	const currentJson = {};
	for (page of pages) {
		const pathArray = page.websitePath.split("/");

		// remove the first element as a websitePath should start with "/" which splits into ['', 'path']
		if (pathArray[0] === "") pathArray.splice(0, 1);

		let prevItems = "";

		// ! oh man this is so bad
		// if you are reading this please dont judge me too hard
		// - Its bad practice
		// - Its a terrible code smell
		// - Its vulnerable to malicious attacks / code injection
		for (let i in pathArray) {
			prevItems += `[pathArray[${i}]]`;
			if (!eval(`currentJson${prevItems}`)) {
				eval(`currentJson${prevItems} = {}`);
			}
		}
	}
	debug(currentJson);
	return currentJson;
};

module.exports = previewSiteLayout;
