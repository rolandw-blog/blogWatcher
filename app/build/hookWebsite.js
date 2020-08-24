const signPayload = require("./signPayload");
const fetch = require("node-fetch");
const debug = require("debug")("blogWatcher:hookBlog");
/**
 * Sends the markdown and _id of every page currently on the filesystem to a url
 * @param {String} url - url of the website endpoint to poll
 * @example hookWebsite("http://192.168.0.100:2020/download")
 */
const hookWebsite = async (page, markdown, url) => {
	debug(`posting new content for page ${page._id} to ${url}`);

	// construct a body for the request
	const body = {
		id: page._id,
	};

	// need to attach markdown in this seperate way
	// otherwise if markdown = undefined is parsed to the URLparams
	// but isnt parsed when the JSON is stringified in signPayload
	// which causes the sig to be incorrect
	if (markdown) body.markdown = markdown;

	// convert the body into x-www-urlencoded params
	const params = new URLSearchParams(body);

	// sign it using the body json
	const sig = signPayload(body);

	// create a header object
	const headers = {
		"x-payload-signature": sig,
	};

	return fetch(`${process.env.PROTOCOL}://${process.env.BLOG_IP}/download`, {
		method: "POST",
		body: params,
		headers: headers,
	});
};
module.exports = hookWebsite;
