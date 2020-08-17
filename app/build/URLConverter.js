// Different functions to extract useful file names from urls
const debug = require("debug")("blogWatcher:URLConverter");
const path = require("path");

/**
 *
 * @param {String} url - Github URL to convert to Path Array
 * @example RawgithubUserContentToPageName("https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Writing/bookmarks.md")
 * @returns ["writing", "bookmarks"]
 */
const githubUserContentToPathArray = (url) => {
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

/**
 *
 * @param {String} url - Github URL to convert to base name
 * @example getBaseNameFromUrl("https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Writing/bookmarks.md")
 * @returns "bookmarks.md"
 */
const getBaseNameFromUrl = (url) => {
	const urlObj = new URL(url);
	const pageName = decodeURI(path.parse(urlObj.pathname).name);
	return pageName;
};

// /**
//  * Returns a best guess at the website path based on the url to a github repo
//  * @param {String} url
//  */
// const getWebsitePathFromUrl = (url) => {
// 	const urlObj = new URL(url);

// 	// split the url by the origin "https://raw.githubusercontent.com"
// 	const rhs = url.split(urlObj.origin)[1];
// 	const rhsArray = rhs.split("/");
// 	debug(rhsArray);
// 	rhsArray.splice(0, 4);
// 	debug(rhsArray.join("/"));
// 	return rhsArray;
// };

/**
 * formats a website path into something predictable
 * @param {String} websitePath - A website path
 * @example formatWebsitePath("/foo/bar/Page Name");
 * @returns "/foo/bar/page_name"
 */
const formatWebsitePath = (websitePath) => {
	const pathArray = websitePath.split("/");

	for (i in pathArray) {
		// process the path name
		let newPathName = "";
		newPathName = pathArray[i].replace(/ /g, "_");
		newPathName = newPathName.toLocaleLowerCase();

		// replace the pathArray with the formatted path
		pathArray[i] = newPathName;
	}

	// return the new path
	return pathArray.join("/");
};

module.exports = {
	getBaseNameFromUrl,
	githubUserContentToPathArray,
	formatWebsitePath,
};
