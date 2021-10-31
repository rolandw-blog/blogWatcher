import App from "./app";
import Route from "./interfaces/routes.interface";
import IndexRoute from "./routes/index.route";
import PageNotFound from "./routes/pageNotFound.route";
import validateEnv from "./utils/validateEnv";
import loggerFunction from "./utils/genericLogger";
import Database from "./database";
const logger = loggerFunction(__filename);
import dotenv from "dotenv";
import GetPageRoute from "./routes/page/getPage.route";
import PostPageRoute from "./routes/page/postPage.route";
import SearchPageRoute from "./routes/page/searchPage.route";
import GetPageRouteLean from "./routes/page/getPageLean.route";
import getRecentCreatedPages from "./routes/page/getRecentCreatedPages.route";
dotenv.config();

logger.info("Starting up");

if (validateEnv() === false) {
	throw new Error("Environment was not correctly set up");
} else {
	logger.debug("environment validated successful");
}

async function start() {
	try {
		// the database should only be connected to once,
		//     then mongoose handles all the future connections and tcp-keepalives
		const conn = await new Database().connect();

		// We get the Route[] interface and use that to craft the IndexRoute
		// The array of routes is passed into the App
		const routes: Route[] = [
			new IndexRoute(),
			new GetPageRoute(conn),
			new GetPageRouteLean(conn),
			new PostPageRoute(conn),
			new SearchPageRoute(conn),
			new getRecentCreatedPages(conn),
		];

		// push the last route which is a 404 page
		routes.push(new PageNotFound());

		// then create the app and start listening on the port
		new App(routes, { port: "3001" }).listen();
	} catch (err) {
		// if there is an error on the initial connection it will be caught here
		logger.error(err);
		logger.error("exiting");
	}
}

start();
