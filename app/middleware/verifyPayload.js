const crypto = require("crypto");
const debug = require("debug")("blogWatcher:PayloadVerify");
const error = require("debug")("blogWatcher:");
require("dotenv").config();

const secret = process.env.DB_API_SECRET;
const sigHeaderName = "x-payload-signature";

function verifyBuilderPayload(req, res, next) {
	debug("running payload verify middleware");

	if (!req.body)
		return res.status(500).json({ success: false, error: "no body" });

	let sig =
		"sha1=" +
		crypto
			.createHmac("sha1", secret)
			.update(JSON.stringify(req.body))
			.digest("hex");

	// debug(req.headers);
	debug(`loc sig: ${sig}`);
	debug(`rem sig: ${req.headers[sigHeaderName]}`);

	if (req.headers[sigHeaderName] == sig) {
		debug("all good");
	} else {
		debug("all bad");
		return res.status(500).json({ success: false });
	}
	return next();
}

module.exports = verifyBuilderPayload;
