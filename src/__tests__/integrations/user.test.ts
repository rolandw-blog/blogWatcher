import App from "../../app";
import UserRoute from "../../routes/user.route";
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
		// before any test starts connect to the database
		const conn = await db.connect();

		// create routes to use for testing. 404 needs to be here to test 404 errors
		const routes = [new UserRoute(conn), new PageNotFoundRoute()];

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

	test("The user is returned when requested", async () => {
		const response = await request.get("/user/6120e4deee1fd0e410fe1d58");
		expect(response.status).toBe(200);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

		// validate the response equals what we expected
		expect(response.body).toEqual({
			_id: "6120e4deee1fd0e410fe1d58",
			name: "roland",
			likes: "chocolate",
		});
	});

	test("Where user does not exist return 404 user not found", async () => {
		const response = await request.get("/user/not found");
		expect(response.status).toBe(500);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body).toEqual({ message: "Malformed ID", details: {} });
	});

	test("Where user does not exist return 404 user not found", async () => {
		const response = await request.get("/user/-1");
		expect(response.status).toBe(500);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body).toEqual({ message: "Malformed ID", details: {} });
	});

	test("Where user does not exist return 404 user not found", async () => {
		const response = await request.get("/user/99999");
		expect(response.status).toBe(500);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body).toEqual({ message: "Malformed ID", details: {} });
	});

	test("No id param returns 404 page not found", async () => {
		const response = await request.get("/users/");
		expect(response.status).toBe(404);
		expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
		expect(response.body).toEqual({ message: "Page not found", details: {} });
	});
});
