const yup = require("yup");

const schema = yup.object().shape({
	pageName: yup.string().required(),
	source: yup.object().shape({
		remote: yup.boolean().required(),
		path: yup.array().required(),
	}),
	websitePath: yup.string().required(),
});

module.exports = schema;
