const previewSiteLayout = require("../build/previewSiteLayout");
const debug = require("debug")("blogWatcher:previewPage");

const previewPages = async (req, res) => {
	const pages = await previewSiteLayout();

	if (pages) return res.status(200).json(pages);

	return res.status(500).json({
		success: false,
		error: "something went wrong. not sure what tho",
	});
};

module.exports = previewPages;
