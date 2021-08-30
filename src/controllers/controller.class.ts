//
// This controller class is used to extend other controllers
// EG. `class userController extends Controller`
// This enforces that there is a connection object available.
// The reason why it exists it because it helps avoid mistakes where there is no connection to use.
// Lastly, if your controller doesnt need a connection, this theres no pressure not to use it.
//

// import { Model } from "mongoose";
// import { IUserModel } from "../models/mongoose/User.schema";
import UserService from "../services/user.service";

export default class Controller {
	service: UserService;
	constructor(service: UserService) {
		this.service = service;
	}
}
