// const { Page } = require("../models/page");
const buildPageFunction = require("../build/buildPage");
const signPayload = require("../build/signPayload");
const debug = require("debug")("blogWatcher:buildFile");
const fetch = require("node-fetch");
const { v4 } = require("uuid");

const buildPage = async (req, res) => {
	debug("=======================");
	// debug(` ${req.params.id}`);
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
	// const body = { id: req.params.id, entropy: v4() };
	// const params = new URLSearchParams(body);

	// // sign the body
	// const sig = signPayload(body);

	// // create a header object
	// debug("setting headers");
	// const headers = {
	// 	"x-payload-signature": sig,
	// };

	// tell the website to build this page
	// await fetch(`http://192.168.0.100:2020/build/${req.params.id}`, {
	// 	method: "POST",
	// 	body: params,
	// 	headers: headers,
	// }).then((res) => res.json());

	return res.status(200).json({
		success: true,
		page: page,
		message: "the page is rebuilt!",
	});
};

module.exports = buildPage;
