// =============================================================================
// This is just ONE route. A new file is created for every route
// The Route contains an PageController which is a standard-ish MVC controller
// 		The job for PageController is to actually run some code for the request
// =============================================================================

import { Router } from "express";
import { Connection } from "mongoose";
import Route from "../../interfaces/routes.interface";
import PageController from "../../controllers/page.controller";

// to register the model with the database connection
import registerModel from "../../registerModel";
import pageSchema, { IPageDocument, IPageModel } from "../../models/mongoose/page.schema";

// the service that provides methods for querying against in the database
import PageService from "../../services/page.service";

class getRecentCreatedPages implements Route {
	public path = "/recent/created";
	public router = Router({ strict: true });
	private controller: PageController;
	private model: IPageModel;

	// the route is typically initialized on the index.ts file after the database connection  (conn) is made
	//     so that it (conn) can be passed to the constructor of this class
	constructor(conn: Connection) {
		// associate the model with the connection
		this.model = registerModel<IPageDocument, IPageModel>(conn, pageSchema, "Page");

		// create a PageService to interact with the database
		const service = new PageService(this.model);

		// create the controller, passing in the service
		this.controller = new PageController(service);

		// initialize the routes with the express router
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, this.controller.getRecentCreatedPages);
	}
}

export default getRecentCreatedPages;
