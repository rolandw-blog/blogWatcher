// const { Page } = require("../models/page");
const buildPagesFunction = require("../build/buildPages");
const hookWebsite = require("../build/hookWebsite");
const { v4 } = require("uuid");
const fetch = require("node-fetch");
const crypto = require("crypto");
const debug = require("debug")("blogWatcher:postPage");

const buildPages = async (req, res) => {
	// TODO make an event emitter to .on("progress") and send data back to the client
	//
	// example of sending data back
	//
	// var c = 0;
	// var interval = setInterval(function() {
	// 	res.write(JSON.stringify({ foo: Math.random() * 100, count: ++c }) + '\n');
	// 	if (c === 10) {
	// 	  clearInterval(interval);
	// 	  res.end();
	// 	}
	//   }, 1000);

	try {
		// build the pages
		debug("building pages...");
		await buildPagesFunction();
		debug("finished building pages...");

		// once buildpages has finished posting all the content
		// then update the blog with new content
		debug("posting pages to website...");
		await hookWebsite("http://192.168.0.100:2020/download");
		debug("finished posting pages to website...");

		debug("now telling the website to build itself");

		const body = { uuid: v4() };
		const params = new URLSearchParams(body);
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

		fetch("http://192.168.0.100:2020/build", {
			method: "POST",
			body: params,
			headers: headers,
		}).then((res) => res.json());

		return res.status(200).json({
			success: true,
			message: "the pages are rebuilt!",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "error: " + err,
		});
	}
};

module.exports = buildPages;
