const crypto = require("crypto");
const fs = require("fs");
const signPayload = require("./signPayload");
const fetch = require("node-fetch");
const { promisify } = require("util");
const debug = require("debug")("blogWatcher:hookWeb");
const { v4 } = require("uuid");
const read = promisify(fs.readFile);

/**
 * Sends the markdown and _id of every page currently on the filesystem to a url
 * @param {String} url - url of the website endpoint to poll
 * @example hookWebsite("http://192.168.0.100:2020/download")
 */
const hookWebsite = async (fileName, url) => {
	debug("posting new content to", url);

	// read the file
	const markdown = await read(`/usr/src/app/content/${fileName}`, "utf-8");

	// construct a body for the request
	const body = {
		fileName: fileName,
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
	}).then((res) => res.json());
};
module.exports = hookWebsite;
