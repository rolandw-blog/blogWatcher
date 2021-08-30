import App from "../../app";
import IndexRoute from "../../routes/index.route";
import PageNotFoundRoute from "../../routes/pageNotFound.route";
import { Application } from "express";
import { Server } from "http";
import Database from "../../database";
import AppOptions from "../../interfaces/appOptions.interface";
// eslint-disable-next-line node/no-unpublished-import
import supertest, { SuperTest, Request } from "supertest";

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
		// create routes to use for testing. 404 needs to be here to test 404 errors
		const routes = [new IndexRoute(), new PageNotFoundRoute()];

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
		db.disconnect();
	});

	test("docs can be reached without trailing slash", async () => {
		const response = await request.get("/api-docs");
		expect(response.status).toBe(200);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body.openapi).toEqual("3.1.0");
	});

	test("docs can be reached with trailing slash", async () => {
		const response = await request.get("/api-docs/");
		expect(response.status).toBe(200);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body.openapi).toEqual("3.1.0");
	});
});
