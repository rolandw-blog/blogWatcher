const fetch = require("node-fetch");
const debug = require("debug")("blogWatcher:downloadMD");

// do some processing on the url
// Sub in the github token to use my private repos
/**
 *
 * @param {String} url
 */
const treatUrl = (url) => {
	const tokenReplace = new RegExp(/TOKEN/);
	const result = url.replace(tokenReplace, process.env.GITHUB_PERSONAL_TOKEN);
	return result;
};

/**
 * Downloads raw markdown from a url (usually github)
 * @param {String} url
 */
const downloadMarkdown = async (url) => {
	debug("downloading markdown...");
	url = decodeURI(url);
	// debug(url);

	// fetch the content in async. await the response immediately
	const response = await fetch(treatUrl(url));

	if (response.status != 200) {
		debug(`Error fetching file: ${response.status}`);
	}

	// return the markdown text
	return await response.text();
};

module.exports = downloadMarkdown;
