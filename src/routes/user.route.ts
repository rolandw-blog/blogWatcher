// =============================================================================
// This is just ONE route. A new file is created for every route
// The Route contains an userController which is a standard-ish MVC controller
// 		The job for userController is to actually run some code for the request
// =============================================================================

import { Router } from "express";
import { Connection } from "mongoose";
import Route from "../interfaces/routes.interface";
import UserController from "../controllers/user.controller";

// for validating the body of the request...
//     The "userRequestSchema" is a JSONSchemaType for AJV to consume
//     The UserRequest is a typescript <Type> for JSONSchemaType
import Ajv from "ajv";
import userRequestSchema, { UserRequest } from "./requests/user_id";
import validateRequest from "../middleware/validateReq.middleware";

// to register the model with the database connection
import registerModel from "../registerModel";
import userSchema, { IUserDocument, IUserModel } from "../models/mongoose/User.schema";

// the service that provides methods for querying against in the database
import UserService from "../services/user.service";

class UserRoute implements Route {
	public path = "/user/:id";
	public router = Router({ strict: true });
	private controller: UserController;
	private validator = new Ajv().compile(userRequestSchema);
	private model: IUserModel;

	// the route is typically initialized on the index.ts file after the database connection  (conn) is made
	//     so that it (conn) can be passed to the constructor of this class
	constructor(conn: Connection) {
		// associate the model with the connection
		this.model = registerModel<IUserDocument, IUserModel>(conn, userSchema, "User");

		// create a userservice to interact with the database
		const service = new UserService(this.model);

		// create the controller, passing in the service
		this.controller = new UserController(service);

		// initialize the routes with the express router
		this.initializeRoutes();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private middleware(): Array<any> {
		return [validateRequest<UserRequest>("params", this.validator)];
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, [...this.middleware()], this.controller.user);
	}
}

export default UserRoute;
