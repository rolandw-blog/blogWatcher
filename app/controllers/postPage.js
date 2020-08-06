const { Page } = require("../models/page");
const debug = require("debug")("blogWatcher:postPage");
const findPage = require("../queries/findPage");
const yupPageSchema = require("../validation/pageSchema");
const util = require("util");

const postPage = async (req, res) => {
	debug("Saving a new page");

	// ! this was a validator but im gonna use happi/joi eventually so...
	// if (!pageName || !type || !path) {
	// 	return res
	// 		.status(422)
	// 		.json({ success: false, error: "u didnt include enough info" });
	// }

	let page = new Page();

	page.pageName = req.body.pageName;
	page.source.remote = req.body.remote;
	page.source.path = req.body.path;
	page.websitePath = req.body.websitePath;
	page.meta.template = req.body.template;

	// check its a valid page against the yup schema
	// TODO clean up this spaghetti
	yupPageSchema
		.validate(page)
		.then(async () => {
			// if its valid make sure it doesnt exist
			if (!(await findPage(page.pageName))) {
				page.save().then((doc) => {
					debug(`Saved ${doc._id}`);
				});
			} else {
				debug(`the page ${page.pageName} already exists`);
				return res.status(409).send("record already exists");
				// .json({ success: false, error: "record already exists" });
			}
		})
		.catch((err) => {
			// if its a validation error (yup returns err.name object)
			debug("validation error occured");
			debug("It could already exist, or incorrectly formatted?");

			// if its not a generic error print it (ie. yup returned it)
			if (err.name != "Error")
				debug(`Name: ${err.name}\nMessage: ${err.errors}`);
		});

	res.status(200).json({ success: true });
};

module.exports = postPage;
