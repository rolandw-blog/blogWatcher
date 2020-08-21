const mongoose = require("mongoose");

const schema = {
	timestamp: {
		type: String,
		require: true,
	},
	message: {
		type: String,
		require: true,
	},
	modified: {
		type: Array,
		require: false,
	},
	committer: {
		require: false,
		name: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
		},
		username: {
			type: String,
			require: true,
		},
	},
};

const historySchema = mongoose.Schema(schema, {
	collection: "History",
	autoCreate: true,
});

const History = mongoose.model("History", historySchema);

module.exports = { History, schema };
