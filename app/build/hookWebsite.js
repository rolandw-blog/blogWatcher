const crypto = require("crypto");
const fs = require("fs");
const fetch = require("node-fetch");
const { promisify } = require("util");
const debug = require("debug")("blogWatcher:hookWebsite");
const read = promisify(fs.readFile);

/**
 * Sends the markdown and _id of every page currently on the filesystem to a url
 * @param {String} url - url of the website endpoint to poll
 * @example hookWebsite("http://192.168.0.100:2020/download")
 */
const hookWebsite = async (url) => {
	// for (page of pages) {
	// 	for (source of page.source) {
	const files = fs.readdirSync("/usr/src/app/content");
	for (file of files) {
		// read the file
		const markdown = read(`/usr/src/app/content/${file}`);

		// construct a body for the request
		const body = {
			id: file.split("_")[0],
			markdown: await markdown,
		};

		debug(file.split("_")[0]);

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
		const headers = {
			"x-payload-signature": sig,
		};

		fetch(`${url}/${file.split("_")[0]}`, {
			method: "POST",
			body: params,
			headers: headers,
		})
			.then((res) => res.json())
			.then((json) => console.log(json));
	}
};
module.exports = hookWebsite;
