import loggerFunction from "./genericLogger";
const logger = loggerFunction(__filename);

const validateEnv = function (): boolean {
	const errors: Array<string> = [];
	const e = process.env;

	const expectedEnv = [
		"NODE_ENV",
		"DOMAIN",
		"LOG_LEVEL",
		"MONGOOSE_USERNAME",
		"MONGOOSE_PASSWORD",
		"MONGOOSE_HOST",
		"MONGOOSE_PORT",
		"MONGOOSE_DATABASE",
		"MONGOOSE_AUTH_SOURCE",
	];

	for (const envVar of expectedEnv) {
		if (typeof e[envVar] === "undefined") errors.push(`${envVar} is not defined`);
	}

	for (const err in errors) {
		logger.error(err);
	}

	if (errors.length > 0) return false;
	else return true;
};

export default validateEnv;
