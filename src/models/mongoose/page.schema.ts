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
	placeholder(model: IPageModel): Promise<Document[]>;
}

// `_id : {id:false}` means that mongoose will not generate an id for us when saving documents
// mongoose wants to generate an id for this nested object for some reason so we need to tell it not to
const pageSchema = new Schema<IPageDocument>(
	{
		name: { type: String },
		source: [{ url: { type: String }, _id: { id: false } }],
		path: [{ type: String }],
		meta: {
			template: { type: String },
			hero: { type: String },
			hidden: { type: Boolean },
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

pageSchema.virtual("url").get(function (this: IPage) {
	return this.path.join("/");
});

export default pageSchema;
