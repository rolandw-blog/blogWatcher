const fetch = require("node-fetch");
const debug = require("debug")("blogWatcher:buildFiles");

const downloadMarkdown = async (url) => {
	url = decodeURI(url);
	debug("downloading page: ");
	debug(url);

	// fetch the content in async. await the response immediately
	const response = await fetch(url);

	if (response.status != 200) {
		debug(chalk.red(`Error fetching file: ${response.status}`));
	}

	// return the markdown text
	return await response.text();
};

module.exports = downloadMarkdown;
