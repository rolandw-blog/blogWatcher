const crypto = require("crypto");
const fs = require("fs");
const fetch = require("node-fetch");
const { promisify } = require("util");
const debug = require("debug")("blogWatcher:hookWeb");
const read = promisify(fs.readFile);

/**
 * Sends the markdown and _id of every page currently on the filesystem to a url
 * @param {String} url - url of the website endpoint to poll
 * @example hookWebsite("http://192.168.0.100:2020/download")
 */
const hookWebsite = async (url) => {
	debug("posting new content to", url);
	const jobs = [];
	const files = fs.readdirSync("/usr/src/app/content");
	for (file of files) {
		debug(files);
		// read the file
		const markdown = await read(`/usr/src/app/content/${file}`);
		// construct a body for the request
		const body = {
			fileName: file,
			markdown: markdown,
		};

		// convert the body into x-www-urlencoded params
		const params = new URLSearchParams(body);

		// sign it
		let sig =
			"sha1=" +
			crypto
				.createHmac("sha1", "P@ssw0rd")
				.update(body.toString())
				.digest("hex");

		debug(`signed as: ${sig}`);

		// create a header object
		debug("setting headers");
		const headers = {
			"x-payload-signature": sig,
		};

		const f = fetch(`http://192.168.0.100:2020/download`, {
			method: "POST",
			body: params,
			headers: headers,
		}).then((res) => res.json());

		jobs.push(f);
	}
	debug("Finished pushing pages to website");
	await Promise.all(jobs);
	return true;
};
module.exports = hookWebsite;
