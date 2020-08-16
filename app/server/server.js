const { connectToDB } = require("../database/database");
const debug = require("debug")("blogWatcher:server");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const pageRoutes = require("../routes/pageRoutes.js");
const webhooks = require("../routes/webhooks");
const getAllPages = require("../queries/getAllPages");
const { URLSearchParams } = require("url");
require("dotenv").config();

// stuff for testing
const buildPages = require("../build/buildPages");
const findPage = require("../queries/findPage");
const previewSiteLayout = require("../build/previewSiteLayout");
const urlConverter = require("../build/URLConverter");
const hookWebsite = require("../build/hookWebsite");

const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));

app.use("/", pageRoutes);
app.use("/hooks", webhooks);

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

	// ! testing stuff

	// hookWebsite("http://192.168.0.100:2020/download");

	// previewSiteLayout();

	// pull down all the markdown
	// buildPages();

	// urlConverter.githubUserContentToPageName(
	// 	"https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Writing/bookmarks.md"
	// );

	// urlConverter.gistContentToPageName(
	// 	"https://gist.githubusercontent.com/RolandWarburton/0f113f46fd780b24973830ab1794dee3/raw/723f35a59ba7a62e258b17d5a55eb9d2d5534964/test.md"
	// );
};

module.exports = server();
