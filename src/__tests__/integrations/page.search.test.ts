import App from "../../app";
import PageNotFoundRoute from "../../routes/pageNotFound.route";
import { Application } from "express";
import { Server } from "http";
import Database from "../../database";
import AppOptions from "../../interfaces/appOptions.interface";
// eslint-disable-next-line node/no-unpublished-import
import supertest, { SuperTest, Request } from "supertest";
import SearchPageRoute from "../../routes/page/searchPage.route";
import GetPageRoute from "../../routes/page/getPage.route";

const expectedAsArray = [
	{
		meta: { template: "blogPost.ejs", hero: "hero value", hidden: false },
		path: ["deleteMe", "test1"],
		_id: "612e1056ee1fd0e410fe1e29",
		name: "testPage1",
		source: [
			{
				url: "https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Linux/Apt%20Package%20Manager.md",
			},
		],
	},
];

const expectedAsObject = {
	meta: { template: "blogPost.ejs", hero: "hero value", hidden: false },
	path: ["deleteMe", "test1"],
	_id: "612e1056ee1fd0e410fe1e29",
	name: "testPage1",
	source: [
		{
			url: "https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Linux/Apt%20Package%20Manager.md",
		},
	],
};

describe("user integrations", () => {
	let app: App;
	let server: Application;
	let request: SuperTest<Request>;
	let liveServer: Server;
	const db = new Database();
	const options: AppOptions = {
		port: (Math.floor(Math.random() * (8000 - 4000)) + 3000).toString(),
	};

	beforeAll(async () => {
		// before any test starts connect to the database
		const conn = await db.connect();

		// create routes to use for testing. 404 needs to be here to test 404 errors
		const routes = [new SearchPageRoute(conn), new GetPageRoute(conn), new PageNotFoundRoute()];

		// also create a new app that we will mutate the port of later
		app = new App(routes, options);
	});

	beforeEach(async () => {
		// set a random port before each test to ensure that multiple can run at once
		app.port = (Math.floor(Math.random() * (8000 - 4000)) + 3000).toString();

		// start listening on the server on that new random port
		liveServer = app.listen();

		// set up supertest agent to listen on that port
		server = app.getServer();
		request = supertest(server);
	});

	afterEach(async () => {
		// after each run close the server so we can set it up with a new port again
		liveServer.close();
	});

	afterAll(async () => {
		// once we are done disconnect from the database
		await db.disconnect();
	});

	test("Search a page by its ID", async () => {
		const response = await request.get("/page/612e1056ee1fd0e410fe1e29");
		expect(response.status).toBe(200);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

		// validate the response equals what we expected
		expect(response.body).toEqual(expectedAsObject);
	});

	test("Search a page by its ID returns 404 with correctly formed ID", async () => {
		const response = await request.get("/page/aaaaaaaaaaaaaaaaaaaeaaaa");
		expect(response.status).toBe(404);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body).toEqual({ message: "Page was not found", details: {} });
	});

	test("Search a page by its ID returns 400 with incorrectly formed ID", async () => {
		const response = await request.get("/page/abc");
		expect(response.status).toBe(400);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body).toEqual({
			message: "wrong params from validate middleware",
			details: [
				{
					keyword: "pattern",
					dataPath: "/id",
					schemaPath: "#/properties/id/pattern",
					params: { pattern: "^[a-f\\d]{24}$" },
					message: 'should match pattern "^[a-f\\d]{24}$"',
				},
			],
		});
	});

	test("Search a page by its name", async () => {
		const response = await request.get("/pages?name=testPage&limit=1");
		expect(response.status).toBe(200);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

		// validate the response equals what we expected
		expect(response.body).toEqual(expectedAsArray);
	});

	test("Search a page by its template", async () => {
		const response = await request.get("/pages?template=blogPost.ejs");
		expect(response.status).toBe(200);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

		// check that we got some results back
		expect(response.body.length).toBeGreaterThanOrEqual(1);
		expect(response.body[0].meta.template).toBe("blogPost.ejs");
	});

	test("Search a page by its name and template", async () => {
		const response = await request.get("/pages?template=blogPost.ejs&name=testPage&limit=1");
		expect(response.status).toBe(200);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

		// validate the response equals what we expected
		expect(response.body).toEqual(expectedAsArray);
	});

	test("Search pagination pages work", async () => {
		const response1 = await request.get("/pages?name=testPage&limit=1&page=1");
		const response2 = await request.get("/pages?name=testPage&limit=1&page=2");
		expect(response1.status).toBe(200);
		expect(response2.status).toBe(200);
		expect(response1.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response2.header["content-type"]).toBe("application/json; charset=utf-8");

		// check data came back
		expect(response1.body.length).toBeGreaterThanOrEqual(1);
		expect(response2.body.length).toBeGreaterThanOrEqual(1);

		// check that by changing the page we get different results
		expect(response1.body[0]).not.toEqual(response2.body[0]);
	});
});
