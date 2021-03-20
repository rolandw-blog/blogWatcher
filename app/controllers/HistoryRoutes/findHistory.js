const debug = require("debug")("blogWatcher:findHistory");
const findHistoryQuery = require("../../queries/findHistory");

const findHistory = async (req, res) => {
	const pageID = req.params._id;
	try {
		// build the pages
		const history = await findHistoryQuery(pageID);
		return res.status(200).json(history);
	} catch (err) {
		return res.status(500).json({
			message: "error: " + err,
		});
	}
};

module.exports = findHistory;
