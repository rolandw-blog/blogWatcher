const mongoose = require("mongoose");
const { ogPageSchema } = require("../models/page");

const schema = ogPageSchema;

const pageSchema = mongoose.Schema(schema, {
	collection: "pages",
	autoCreate: true,
});

const Page = mongoose.model("Page", pageSchema);

module.exports = { Page, schema };

// const example = {
// 	pageName: "hello world",
// 	pageSource:
// 		"https://raw.githubusercontent.com/RolandWarburton/knowledge/master/programming/Principles%20of%20OOP.md",
// 	fsPath: "content/file.md",
// 	template: "templates/page.ejs",
// 	meta: {
// 		history: [
// 			{
// 				date: "1/1/1",
// 				hash: "abc123",
// 				comment: "hello this is a comment",
// 			},
// 		],
// 	},
// };

// {
// 	"pageName": "hello world",
// 	"source": {
// 		"type": "remote",
// 		"path": "https://raw.githubusercontent.com/RolandWarburton/knowledge/master/programming/Principles%20of%20OOP.md"
// 	},
// 	"fsPath": "content/file.md",
// 	"template": "templates/page.ejs",
// 	"meta": {
// 		"history": [{
// 			"date": "1/1/1",
// 			"hash": "abc123",
// 			"comment": "hello this is a comment"
// 		}]
// 	}
// }
