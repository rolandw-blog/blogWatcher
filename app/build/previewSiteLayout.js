// Returns JSON structure of what the website will look like based on the database of sources
const debug = require("debug")("blogWatcher:previewSiteLayout");
const getAllPages = require("../queries/getAllPages");
const merge = require("lodash.merge");

/**
 * Converting an absolute path into a json object [] => {}
 *
 *  THANKS TO nickmcm92 for helping me with this function‼
 * @param {String} websitePath - A (preferebly) absolute path to a page on the website
 * @example urlToJson(/sample/too/page)
 */
// ! THANKS TO nickmcm92 for helping me with this function‼
// ! https://github.com/nickmcm92
const urlToJson = (websitePaths) => {
	const outputResult = [];

	for (websitePath of websitePaths) {
		const pathArray = websitePath.split("/");

		// Remove the first element as a websitePath should start with "/" which splits into ['', 'path']
		if (pathArray[0] === "") pathArray.splice(0, 1);

		// store the new json path as a string which can be parsed to JSON later
		var jsonstr = "";

		// construct a string of json values
		for (var i = pathArray.length - 1; i >= 0; i--) {
			jsonstr = `"${pathArray[i]}": {${jsonstr}}`;
		}
		// wrap the string of json values in a json object
		jsonstr = `{${jsonstr}}`;

		// convert it into JSON
		outputResult.push(JSON.parse(jsonstr));
	}
	return outputResult;
};

/**
 * Returns a JSON object that represents the full websites path structure
 */
const previewSiteLayout = async () => {
	debug("running previewSiteLayout");

	// get every page from the database
	const pages = await getAllPages();

	// this is where each JSON path is stored as an individual object
	const allJson = [];
	// let prevItems = "";
	for (page of pages) {
		const newJson = urlToJson(page.websitePath);
		allJson.push(newJson);

		debug(`parsed ${page.websitePath} to a json path`);
	}

	debug("Finished formatting the path map:");
	debug(JSON.stringify(merge(...allJson), null, 2));

	return merge(...allJson);
};

module.exports = previewSiteLayout;

// An example of exported data from previewSiteLayout()
//
// {
// 	sample: {
// 		too: {
// 			page: {},
// 		},
// 		three: {
// 			page: {},
// 		},
// 	},
// };
