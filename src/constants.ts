const API_URL = process.env["API_URL"] || "http://localhost:3000";
const NODE_ENV = process.env["NODE_ENV"] || "development";
const DOMAIN = process.env["DOMAIN"] || "blogbuilder";
const PORT = process.env["PORT"] || "3000";
const LOG_LEVEL = process.env["LOG_LEVEL"] || "debug";
const MONGOOSE_USERNAME = process.env["MONGOOSE_USERNAME"] || "";
const MONGOOSE_PASSWORD = process.env["MONGOOSE_PASSWORD"] || "";
const MONGOOSE_HOST = process.env["MONGOOSE_HOST"] || "localhost";
const MONGOOSE_PORT = process.env["MONGOOSE_PORT"] || "27017";
const MONGOOSE_DATABASE = process.env["MONGOOSE_DATABASE"] || "blogbuilder";
const MONGOOSE_AUTH_SOURCE = process.env["MONGOOSE_AUTH_SOURCE"] || "admin";

export {
	API_URL,
	NODE_ENV,
	DOMAIN,
	PORT,
	LOG_LEVEL,
	MONGOOSE_USERNAME,
	MONGOOSE_PASSWORD,
	MONGOOSE_HOST,
	MONGOOSE_PORT,
	MONGOOSE_DATABASE,
	MONGOOSE_AUTH_SOURCE,
};
