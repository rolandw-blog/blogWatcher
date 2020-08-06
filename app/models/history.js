const mongoose = require("mongoose");

const schema = {
	head_commit: {
		// a JSON string is submitted
		type: String,
		require: true,
	},
};

const historySchema = mongoose.Schema(schema, {
	collection: "pages",
	autoCreate: true,
});

const History = mongoose.model("Page", historySchema);

module.exports = { History, schema };
