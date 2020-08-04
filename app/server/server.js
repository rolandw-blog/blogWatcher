const { connectToDB } = require("../database/database");
const buildPages = require("../build/buildPages");
const debug = require("debug")("blogWatcher:server");
const path = require("path");
const cors = require("cors");
const previewSiteLayout = require("../build/previewSiteLayout");
const githubUserContentToPageName = require("../build/URLConverter");
require("dotenv").config();

const express = require("express");
const pageRoutes = require("../routes/pageRoutes.js");

const app = express();
// app.options("*", cors());
const corsOptions = {
	origin: "*",
};
app.use(cors(corsOptions));

app.use("/", pageRoutes);

// quick and dirty upload form
app.use("/upload", express.static(path.resolve(process.env.ROOT, "public")));

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

	previewSiteLayout();

	// pull down all the markdown
	// buildPages();

	// githubUserContentToPageName(
	// 	"https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Writing/bookmarks.md"
	// );
};

module.exports = server();
