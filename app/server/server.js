const { connectToDB } = require("../database/database");
const buildPages = require("../build/buildPages");
const debug = require("debug")("blogWatcher:server");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const express = require("express");
const pageRoutes = require("../routes/pageRoutes.js");

const app = express();
// app.options("*", cors());
// const corsOptions = {
// 	origin: "*",
// };
app.use(cors());

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

	// pull down all the markdown
	buildPages();
};

module.exports = server();
