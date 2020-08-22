const crypto = require("crypto");
const debug = require("debug")("blogWatcher:PayloadVerify");
const error = require("debug")("blogWatcher:");
require("dotenv").config();

const secret = process.env.DB_API_SECRET;
const sigHeaderName = "x-blogwatcher-Signature";

function verifyBuilderPayload(req, res, next) {
	debug("running payload verify middleware");

	let sig =
		"sha1=" +
		crypto
			.createHmac("sha1", secret)
			.update(req.body.toString())
			.digest("hex");

	// debug(req.headers);
	debug(`sig: ${sig}`);
	debug(`sig: ${req.headers["x-blogwatcher-signature"]}`);

	if (req.headers["x-blogwatcher-signature"] == sig) {
		debug("all good");
	} else {
		debug("all bad");
		return res.status(500).json({ success: false });
	}
	return next();
}

module.exports = verifyBuilderPayload;
