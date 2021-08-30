import IndexRoute from "../routes/index.route";
import IndexController from "../controllers/index.controller";
import App from "../app";
import UserRoute from "../routes/user.route";
import PageNotFoundRoute from "../routes/pageNotFound.route";
import { Server } from "http";
import Database from "../database";
import AppOptions from "../interfaces/appOptions.interface";
import { Connection } from "mongoose";

describe("Test Index", () => {
	let app: App;
	let liveServer: Server;
	let conn: Connection;
	let indexRoute: IndexRoute;
	const db = new Database();
	const options: AppOptions = {
		port: (Math.floor(Math.random() * (8000 - 4000)) + 3000).toString(),
	};

	beforeAll(async () => {
		// before any test starts connect to the database
		conn = await db.connect();

		// We need properties on this route to use for testing
		indexRoute = new IndexRoute();

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
	});

	afterEach(async () => {
		// after each run close the server so we can set it up with a new port again
		liveServer.close();
	});

	afterAll(async () => {
		// once we are done disconnect from the database
		await db.disconnect();
	});

	describe("route has a controller", () => {
		test("the index route has a controller that is an indexController", () => {
			expect(indexRoute.indexController).toBeInstanceOf(IndexController);
		});
	});
});
