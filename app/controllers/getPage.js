const findPage = require("../queries/findPage");
const debug = require("debug")("blogWatcher:getPage");

// ? The url needs to be formed with params:
// ? example.com/page?pageName=${pageName}
// ? example.com/page?_id=${_id}
// ? example.com/page?websitePath=${websitePath}
const getPage = async (req, res) => {
	let key = "_id";
	let value = "";
	let query = {};

	if (req.query._id) {
		query={"_id": req.query._id}
	}

	if (req.query.websitePath) {
		key = "websitePath";

		// the websitePath within the database is an ARRAY.
		// so we take an array like ["hello", "world"] and turn it into an object for mongoose
		// like {"websitePath.0": "hello", "websitePath.1": "world"} to match against the arrays contents
		let temp = {};

		// construct an array from the website filepath given
		const arr = req.query.websitePath.split("/").filter(String)

		// create the object for the query: {"websitePath.0": "hello", "websitePath.1": "world"}
		for(let i = 0; i < arr.length; i++) {
			temp[`websitePath.${i}`] = arr[i];
		}

		// by default just get the siblings to the website filepath given
		const drillLayers = arr.length + 1 + req.query.levels || arr.length + 1
		query = {...query, ...temp, websitePathLength: drillLayers};
		// console.log(value)
	}

	if (req.query.pageName) {
		// debug("searching by pageName");
		key = "pageName";
		value = req.query.pageName;
	}

	// if (key == "" || value == "") {
	// 	debug("nothing found");
	// 	return res.status(400).json({ success: false, error: "nothing found" });
	// }

	const pages = await findPage(query);
	// console.log(page)
	// return res.status(200).json(page);

	if (pages) return res.status(200).json(pages);
	else return res.status(400).json({ success: false, error: pages });
};

module.exports = getPage;
