const yup = require("yup");

// Emulates the req.body.head_commit from github webhooks
// To sanity check that the data looks like something we would expect
const schema = yup.object().shape({
	id: yup.string().required(),
	tree_id: yup.string().required(),
	distinct: yup.boolean().required(),
	message: yup.string().required(),
	timestamp: yup.string().required(),
	url: yup.string().required(),
	author: {
		name: yup.string().required(),
		email: yup.string().required(),
		username: yup.string().required(),
	},
	committer: {
		name: yup.string().required(),
		email: yup.string().required(),
		username: yup.string().required(),
	},
	added: yup.array(),
	removed: yup.array(),
	modified: yup.array(),
});

module.exports = schema;
