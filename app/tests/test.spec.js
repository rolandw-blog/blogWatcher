const { connectToDB, disconnectFromDB } = require("../database/database");
const debug = require("debug")("blogWatcher:test");
const { Page } = require("../models/page");
require("dotenv").config();

// functions n shit
const post = require("../queries/postPage");
const findPage = require("../queries/findPage");

/**
 * Cleans out the database after testing is complete
 */
const resetDatabase = () => {
	return Page.deleteMany({}, (err, result) => {
		debug(result);
	});
};

/**
 * Test database insertions
 */
describe("insert", () => {
	beforeAll(async () => {
		await connectToDB(
			process.env.DB_USERNAME,
			process.env.DB_PASSWORD,
			process.env.DB_PORT,
			"test",
			"test"
		);
	});

	afterAll(async () => {
		// await resetDatabase();
		await disconnectFromDB();
	});

	it("should insert a doc into collection", async () => {
		// dummy document
		// const page = {
		// 	source: {
		// 		remote: true,
		// 		path: [
		// 			"website.com/test/file1.md",
		// 			"website.com/test2/file2.md",
		// 		],
		// 	},
		// 	meta: { template: "test" },
		// 	pageName: "test",
		// 	websitePath: "test/page/sample",
		// };

		const page = {
			source: [
				{
					remote: true,
					path: "websitte.com/file.md",
					websitePath: "/output/path",
				},
			],
			meta: { template: "test" },
			pageName: "test",
			// websitePath: "test/page/sample",
		};

		// insert
		const pageStatus = await post(page);

		// check it returns success
		expect(pageStatus).toEqual(200);

		// now fetch it and double check it exists
		const fetchedPage = await findPage("pageName", page.pageName);
		expect(await fetchedPage.pageName).toEqual(page.pageName);
	});
});
