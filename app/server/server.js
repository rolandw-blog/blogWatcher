const { connectToDB } = require("../database/database");
const debug = require("debug")("blogWatcher:server");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const urlConverter = require("../build/URLConverter");
const pageRoutes = require("../routes/pageRoutes.js");
const webhooks = require("../routes/webhooks");
const crypto = require("crypto");
const buildPages = require("../build/buildPages");
const previewSiteLayout = require("../build/previewSiteLayout");
require("dotenv").config();

const express = require("express");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
// app.options("*", cors());
const corsOptions = {
	origin: "*",
};
app.use(cors(corsOptions));

app.use("/", pageRoutes);
// app.use("/", webhooks);
app.use(bodyParser.json());

// quick and dirty upload form
app.use("/upload", express.static(path.resolve(process.env.ROOT, "public")));

function verifyGithubPayload(req, res, next) {
	debug("running GH payload verify middleware");

	const payload = JSON.stringify(req.body);
	let sig =
		"sha1=" +
		crypto
			.createHmac("sha1", process.env.GITHUB_SECRET)
			.update(payload.toString())
			.digest("hex");

	debug(sig);
	debug(req.headers["x-hub-signature"]);
	if (req.headers["x-hub-signature"] == sig) {
		debug("all good");
	} else {
		debug("all bad");
	}
	return next();
}

const server = async () => {
	await connectToDB(
		process.env.DB_USERNAME,
		process.env.DB_PASSWORD,
		process.env.DB_PORT,
		process.env.DB_DATABASE,
		process.env.DB_AUTHENTICATION_DATABASE
	);

	app.listen(process.env.PORT, () =>
		debug(`app listening at http://localhost:${process.env.PORT}`)
	);

	app.get("/", (req, res) => {
		res.status(200).json({
			success: true,
			help: "post to /page to upload a new page",
		});
	});

	app.post("/", [urlencodedParser, verifyGithubPayload], (req, res) => {
		res.status(200).json({
			success: true,
		});
	});

	// ! testing stuff

	// previewSiteLayout();

	// pull down all the markdown
	// buildPages();

	urlConverter.githubUserContentToPageName(
		"https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Writing/bookmarks.md"
	);

	// urlConverter.gistContentToPageName(
	// 	"https://gist.githubusercontent.com/RolandWarburton/0f113f46fd780b24973830ab1794dee3/raw/723f35a59ba7a62e258b17d5a55eb9d2d5534964/test.md"
	// );
};

module.exports = server();
