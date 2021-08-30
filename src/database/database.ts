import isDocker from "is-docker";

const username = process.env["MONGOOSE_USERNAME"];
const password = process.env["MONGOOSE_PASSWORD"];
const host = isDocker() ? process.env["MONGOOSE_HOST"] : "localhost";
const port = process.env["MONGOOSE_PORT"];
const database = process.env["MONGOOSE_DATABASE"];
const authSource = process.env["MONGOOSE_AUTH_SOURCE"];

export const dbConnection = {
	url: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		bufferCommands: true,
		socketTimeoutMS: 5000,
		poolSize: 5,
		autoCreate: true,
	},
};
