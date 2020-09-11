const findPage = require("../queries/findPage");
const debug = require("debug")("blogWatcher:getPage");

// ? The url needs to be formed with params:
// ? example.com/page?pageName=${websitePath}
// ? example.com/page?_id=${websitePath}
const getPage = async (req, res) => {
	let key = "_id";
	let value = "";

	if (req.query._id) {
		// debug("searching by _id");
		key = "_id";
		value = req.query._id;
	}
	if (req.query.websitePath) {
		// debug("searching by websitePath");
		key = "websitePath";
		value = req.query.websitePath;
	}
	if (req.query.pageName) {
		// debug("searching by pageName");
		key = "pageName";
		value = req.query.pageName;
	}

	if (key == "" || value == "") {
		debug("nothing found");
		return res.status(400).json({ success: false, error: "nothing found" });
	}

	const page = await findPage(key, value);

	if (page) return res.status(200).json(page);
	else return res.status(400).json({ success: false, error: page });
};

module.exports = getPage;
