const yup = require("yup");

const schema = yup.object().shape({
	pageName: yup.string().required(),
	source: yup.array().of(
		yup.object().shape({
			remote: yup.boolean(),
			url: yup.string(),
		})
	),
	websitePath: yup.string().required(),
});

module.exports = schema;
