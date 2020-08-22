const buildPagesFunction = require("../build/buildPages");
const debug = require("debug")("blogWatcher:buildFiles");

const buildPages = async (req, res) => {
	try {
		// build the pages
		debug("building pages...");
		await buildPagesFunction();

		debug("finished building pages...");
		return res
			.status(200)
			.json({ success: true, message: "built ALL the pages!" });
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "error: " + err,
		});
	}
};

module.exports = buildPages;
