const buildPageFunction = require("../build/buildPage");
const debug = require("debug")("blogWatcher:buildFile");

const buildPage = async (req, res) => {
	debug("=======================");
	// TODO make an event emitter to .on("progress") and send data back to the client
	//
	// example of sending data back
	//
	// var c = 0;
	// var interval = setInterval(function() {
	// 	res.write(JSON.stringify({ foo: Math.random() * 100, count: ++c }) + '\n');
	// 	if (c === 10) {
	// 	  clearInterval(interval);
	// 	  res.end();
	// 	}
	//   }, 1000);

	const page = await buildPageFunction(req.params.id);

	return res.status(200).json({
		success: true,
		page: page,
		message: "the page is rebuilt!",
	});
};

module.exports = buildPage;
