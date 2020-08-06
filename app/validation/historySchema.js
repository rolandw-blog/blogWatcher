const yup = require("yup");

const schema = yup.object().shape({
	commit: yup.string().required(),
});

module.exports = schema;
