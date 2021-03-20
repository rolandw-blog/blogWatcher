const bodyParser = require("body-parser");
const cors = require("cors");

const useTestMiddleware = (app) => {
	return console.log("testing testing 123");
};

const useJsonMiddleware = (app) => {
	const urlencodedParser = bodyParser.urlencoded({
		limit: "50mb",
		extended: true,
	});

	app.use(urlencodedParser);
};

const useUrlencodedMiddleware = (app) => {
	app.use(bodyParser.json());
};

const useCorsMiddleware = () => {
	const corsOptions = { origin: "*", "Access-Control-Allow-Origin": "*" };
	return cors(corsOptions);
};

module.exports = {
	useJsonMiddleware,
	useUrlencodedMiddleware,
	useCorsMiddleware,
	useTestMiddleware,
};
