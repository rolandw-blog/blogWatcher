// Different functions to extract useful file names from urls
const debug = require("debug")("blogWatcher:URLConverter");
const path = require("path");

/**
 *
 * @param {String} url - Github URL to convert to page name
 * @example RawgithubUserContentToPageName("https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Writing/bookmarks.md")
 * @returns ["writing", "bookmarks"]
 */
const githubUserContentToPageName = (url) => {
	// Turn it into a URL
	const urlObject = new URL(url);

	// Get the pathname (/RolandWarburton/knowledge/master/Writing/bookmarks.md)
	const pathArray = urlObject.pathname.split("/");

	// Remove the junk elements at the start
	pathArray.splice(0, 4);

	// Strip the extension from the last page name
	const pageName = pathArray[pathArray.length - 1];
	pathArray[pathArray.length - 1] = path.parse(pageName).name;

	debug(pathArray);
};

module.exports = { githubUserContentToPageName };
