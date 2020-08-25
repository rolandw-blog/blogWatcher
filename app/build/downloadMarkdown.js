const fetch = require("node-fetch");
const debug = require("debug")("blogWatcher:downloadMD");

/**
 * Downloads ram markdown from a url (usually github)
 * @param {String} url
 */
const downloadMarkdown = async (url) => {
	debug("downloading markdown...");
	url = decodeURI(url);
	// debug(url);

	// fetch the content in async. await the response immediately
	const response = await fetch(url);

	if (response.status != 200) {
		debug(`Error fetching file: ${response.status}`);
	}

	// return the markdown text
	return await response.text();
};

module.exports = downloadMarkdown;
