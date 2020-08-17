const fs = require("fs");
const debug = require("debug")("blogWatcher:hookUrl");
const hookWebsite = require("./hookWebsite");

/**
 * Sends the markdown and _id of every page currently on the filesystem to a url
 * @param {String} url - url of the website endpoint to poll
 * @example hookWebsite("http://192.168.0.100:2020/download")
 */
const hookWebsites = async (url) => {
	const jobs = [];
	const files = fs.readdirSync("/usr/src/app/content");
	// const url = "http://192.168.0.100:2020/download";
	for (file of files) {
		debug(`posting ${file} to url`);
		jobs.push(hookWebsite(file, url));
	}
	debug("Finished pushing pages to website");
	await Promise.all(jobs);
	return true;
};
module.exports = hookWebsites;
