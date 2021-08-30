import { Model, Schema, Document } from "mongoose";
import IUser from "../../interfaces/user";

// virtuals and methods go here
// IUserDocument includes both IUser and Document fields/methods
export interface IUserDocument extends IUser, Document {
	myMethod(model: IUserModel): Promise<Document[]>;
	bio: string;
}

// statics go here
// Create an actual implementation of our interface
// Model has a fingerprint that looks like: Model<T, TQueryHelpers = {}, TMethods = {}>
// We need to give Model IUserDocument so that it knows how to create some of its queries and methods etc
// Note that T must derive from mongoose.Document
export interface IUserModel extends Model<IUserDocument> {
	myStatic(model: IUserModel): Promise<Document[]>;
}

const UserSchema = new Schema<IUserDocument>({
	name: {
		type: String,
		set: (name: string) => name.toUpperCase(),
		get: (name: string) => name.toUpperCase(),
	},
	likes: { type: String },
});

UserSchema.static("myStatic", async function (model: IUserModel) {
	return model.find({ likes: "chocolate" }).exec();
});

// methods are defined on the document
UserSchema.method("myMethod", async function (model: IUserModel) {
	return model.find({ likes: "chocolate" }).exec();
});

UserSchema.virtual("bio").get(function (this: IUser) {
	return `${this.name} likes ${this.likes}`;
});

export default UserSchema;
