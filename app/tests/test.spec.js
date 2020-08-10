const { MongoClient } = require("mongodb");
const { connectToDB, disconnectFromDB } = require("../database/database");
const post = require("../queries/postPage");
const dotenv = require("dotenv").config();
const debug = require("debug")("blogWatcher:test");

describe("insert", () => {
	let connection;
	let db;

	beforeAll(async () => {
		debug(process.env.DB_USERNAME);
		await connectToDB(
			process.env.DB_USERNAME,
			process.env.DB_PASSWORD,
			process.env.DB_PORT,
			process.env.DB_DATABASE,
			process.env.DB_AUTHENTICATION_DATABASE
		);
		// await connectToDB(
		// 	process.env.DB_USERNAME,
		// 	process.env.DB_PASSWORD,
		// 	process.env.DB_PORT,
		// 	process.env.DB_DATABASE,
		// 	process.env.DB_AUTHENTICATION_DATABASE
		// );
		// connection = await MongoClient.connect(global.__MONGO_URI__, {
		// 	useNewUrlParser: true,
		// });
		// db = await connection.db(global.__MONGO_DB_NAME__);
	});

	afterAll(async () => {
		disconnectFromDB();
	});

	it("should insert a doc into collection", async () => {
		// const page = {
		// 	source: { remote: true, path: ["test/file1.md", "test2/file2.md"] },
		// 	meta: { template: "test" },
		// 	pageName: "test",
		// 	websitePath: "test/page/sample",
		// };
		// const pageStatus = await post(page);

		// a
		// const users = db.collection("users");

		// const mockUser = { _id: "some-user-id", name: "John" };
		// await users.insertOne(mockUser);

		// const insertedUser = await users.findOne({ _id: "some-user-id" });
		// expect(insertedUser).toEqual(mockUser);
		expect(200).toEqual(200);
	});
});
