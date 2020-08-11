const yup = require("yup");

const schema = yup.object().shape({
	pageName: yup.string().required(),
	source: yup.array().of(
		yup.object().shape({
			remote: yup.boolean().required(),
			url: yup.string().required(),
		})
	),
	websitePath: yup.string().required(),
});

module.exports = schema;
