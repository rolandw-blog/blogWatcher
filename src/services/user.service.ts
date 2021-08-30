import { Types } from "mongoose";
import HttpException from "../exceptions/HttpException";
import { IUserModel, IUserDocument } from "../models/mongoose/User.schema";

// You can do cool things with the user model
// for example using virtuals, methods, getters/setters, and statics
//
// user.bio
// user.myMethod(this.model).then(...)
// user.name = "name"
// this.model.myStatic(this.model).then(...)

class UserService {
	public model: IUserModel;

	constructor(model: IUserModel) {
		this.model = model;
	}

	async getUser(id: Types.ObjectId): Promise<IUserDocument> {
		const user = await this.model.findById(id).exec();
		if (user === null) {
			throw new HttpException(404, "User was not found");
		} else {
			return user;
		}
	}
}

export default UserService;
