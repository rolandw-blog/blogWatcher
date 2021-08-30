import { Model, Schema, Document } from "mongoose";
import IPage from "../../interfaces/page.interface";

// virtuals and methods go here
// IPageDocument includes both IPage and Document fields/methods
export interface IPageDocument extends IPage, Document {
	url: string;
}

// statics go here
// Create an actual implementation of our interface
// Model has a fingerprint that looks like: Model<T, TQueryHelpers = {}, TMethods = {}>
// We need to give Model IPageDocument so that it knows how to create some of its queries and methods etc
// Note that T must derive from mongoose.Document
export interface IPageModel extends Model<IPageDocument> {
	myStatic(model: IPageModel): Promise<Document[]>;
}

const pageSchema = new Schema<IPageDocument>({
	name: { type: String },
	source: [{ remote: { type: Boolean }, url: { type: String } }],
	path: [{ type: String }],
	meta: {
		template: { type: String },
		hero: { type: String },
		hidden: { type: Boolean },
	},
});

pageSchema.virtual("url").get(function (this: IPage) {
	return this.path.join("/");
});

export default pageSchema;
