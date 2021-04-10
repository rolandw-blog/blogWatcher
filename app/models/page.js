const mongoose = require("mongoose");

const schema = {
	pageName: {
		type: String,
		require: true,
	},
	source: {
		type: Array,
		require: false,
		remote: {
			type: Boolean,
			require: true,
		},
		url: {
			type: String,
			require: true,
		},
	},
	websitePath: {
		type: Array,
		require: true,
	},
	websitePathLength: {
		type: Number,
		require: true,
	},
	hidden: {
		type: Boolean,
		require: false,
	},
	meta: {
		require: false,
		template: {
			type: String,
			require: true,
		},
	},
};

const pageSchema = mongoose.Schema(schema, {
	collection: "pages",
	autoCreate: true,
});

const Page = mongoose.model("Page", pageSchema);

module.exports = { Page, schema };
