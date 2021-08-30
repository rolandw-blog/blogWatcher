import mongoose from "mongoose";

const registerModel = function <DocType, M extends mongoose.Model<DocType>>(
	conn: mongoose.Connection,
	schema: mongoose.Schema<DocType>,
	name: string
): M {
	return conn.model<DocType, M>(name, schema);
};

export default registerModel;
