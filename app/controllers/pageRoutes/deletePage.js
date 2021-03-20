const debug = require("debug")("blogWatcher:deletePage");
const deletePageQuery = require("../../queries/deletePage");

// This will always return true regardless of if any page was deleted or not

const deletePageController = async (req, res) => {
	const pageID = req.params._id;
	debug(`deleting page ${pageID}`);
	try {
		await deletePageQuery(pageID).then((result) => {
			debug(result);
			if (result === null) {
				return res
					.status(200)
					.json({ success: true, message: `Deleted page ${pageID}` });
			} else {
				return res.status(500).json({
					success: false,
					message: `Failed to delete ${pageID}. Perhaps it didnt exist? ${result}`,
				});
			}
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "error: " + err,
		});
	}
};

module.exports = deletePageController;
