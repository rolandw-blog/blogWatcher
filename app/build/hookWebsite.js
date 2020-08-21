const crypto = require("crypto");
const fs = require("fs");
const signPayload = require("./signPayload");
const fetch = require("node-fetch");
const { promisify } = require("util");
const debug = require("debug")("blogWatcher:hookBlog");
const { v4 } = require("uuid");
const read = promisify(fs.readFile);

/**
 * Sends the markdown and _id of every page currently on the filesystem to a url
 * @param {String} url - url of the website endpoint to poll
 * @example hookWebsite("http://192.168.0.100:2020/download")
 */
const hookWebsite = async (page, markdown, url) => {
	debug("posting new content to", url);
	debug(page._id);

	// read the file
	// let markdown = "";
	// for (let i = 0; i < page.source.length; i++) {
	// 	const filename = `${page._id}_${i}.md`;
	// 	markdown += await read(`content/${filename}`);
	// }

	// construct a body for the request
	const body = {
		id: page._id,
		markdown: markdown,
	};

	// convert the body into x-www-urlencoded params
	const params = new URLSearchParams(body);

	// sign it using the body json
	const sig = signPayload(body);

	// create a header object
	const headers = {
		"x-payload-signature": sig,
	};

	return fetch(`http://192.168.0.100:2020/download`, {
		method: "POST",
		body: params,
		headers: headers,
	});
};
module.exports = hookWebsite;
