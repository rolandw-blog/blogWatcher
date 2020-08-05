const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const debug = require("debug")("blogWatcher:GitHubPayloadVerify");
require("dotenv").config();

const secret = process.env.GITHUB_SECRET;
const sigHeaderName = "x-Hub-Signature";

// thanks to https://www.digitalocean.com/community/tutorials/how-to-use-node-js-and-github-webhooks-to-keep-remote-projects-in-sync
function verifyGithubPayload(req, res, next) {
	debug("running GH payload verify middleware");

	const payload = JSON.stringify(req.body);
	let sig =
		"sha1=" +
		crypto
			.createHmac("sha1", secret)
			.update(payload.toString())
			.digest("hex");

	debug(sig);
	debug(req.headers["x-hub-signature"]);
	if (req.headers["x-hub-signature"] == sig) {
		// exec('cd ' + repo + ' && git pull');
		debug("all good");
	} else {
		debug("all bad");
		return res.status(500).json({ success: false });
	}
	return next();
}

module.exports = verifyGithubPayload;
