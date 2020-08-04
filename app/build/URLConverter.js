// Different functions to extract useful file names from urls
const debug = require("debug")("blogWatcher:URLConverter");

/**
 *
 * @param {String} url - Github URL to convert to page name
 * @example RawgithubUserContentToPageName("https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Writing/bookmarks.md")
 */
const githubUserContentToPageName = (url) => {
	const urlObject = new URL(url);
	// debug(urlObject);
};

module.exports = githubUserContentToPageName;
