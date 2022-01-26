import {
	MONGOOSE_AUTH_SOURCE,
	MONGOOSE_DATABASE,
	MONGOOSE_HOST,
	MONGOOSE_PASSWORD,
	MONGOOSE_PORT,
	MONGOOSE_USERNAME,
} from "../constants";

const username = MONGOOSE_USERNAME;
const password = MONGOOSE_PASSWORD;
const host = MONGOOSE_HOST;
const port = MONGOOSE_PORT;
const database = MONGOOSE_DATABASE;
const authSource = MONGOOSE_AUTH_SOURCE;

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
