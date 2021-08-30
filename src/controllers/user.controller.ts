// This file is a controller that runs some code when a route is hit
// This file is referenced by the user.route.ts ROUTE which uses UserController (this) as its CONTROLLER

import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import loggerFunction from "../utils/genericLogger";
const logger = loggerFunction(__filename);
import HttpException from "../exceptions/HttpException";
import UserService from "../services/user.service";
import Controller from "./controller.class";

class UserController extends Controller<UserService> {
	private _userService: UserService;

	// a service is a class from ./services the has functionality to interact with the database
	// the service requires a model to be passed to it after it has been registered
	constructor(service: UserService) {
		super(service);
		this._userService = service;
	}

	// returns a user object
	public user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (req.params["id"] === undefined) {
			throw new HttpException(500, "no ID provided");
		}

		try {
			const unparsed_user_id = req.params["id"] as string;
			if (!Types.ObjectId.isValid(unparsed_user_id)) {
				throw new HttpException(500, "Malformed ID");
			}

			const id = Types.ObjectId(req.params["id"]?.toString());

			const user = await this._userService.getUser(id);

			if (user) {
				// the service should throw an error if no user is found
				res.status(200).json(user);
			} else {
				throw new HttpException(500, "Something went wrong");
			}
		} catch (err) {
			logger.debug("passing to next");
			next(err);
		}
	};
}

export default UserController;
