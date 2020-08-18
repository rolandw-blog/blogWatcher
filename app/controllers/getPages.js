const getAllPages = require("../queries/getAllPages");
const debug = require("debug")("blogWatcher:getPages");

const getPage = async (req, res) => {
	const pages = await getAllPages("_id", req.params.id);

	// debug(req.params.id);

	if (pages) return res.status(200).json(pages);
	else
		return res
			.status(400)
			.json({ success: false, error: "its dead jim! 🔨" });
};

module.exports = getPage;
