/**
 * Converting an absolute path into a json object [] => {}
 *
 *  THANKS TO nickmcm92 for helping me with this function‼
 * @param {String} websitePath - A (preferebly) absolute path to a page on the website
 * @example urlToJson(/sample/too/page)
 */
// ! THANKS TO nickmcm92 for helping me with this function‼
// ! https://github.com/nickmcm92
const urlToJson = (websitePath) => {
	const outputResult = [];

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
	return outputResult;
};

module.exports = urlToJson;
