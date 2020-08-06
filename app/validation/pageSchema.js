const yup = require("yup");

const schema = yup.object().shape({
	pageName: yup.string().required(),
	source: {
		remote: yup.boolean().required(),
		path: yup.string().required(),
	},
	websitePath: yup.string().required(),
});

module.exports = schema;
