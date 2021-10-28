import IndexController from "../controllers/index.controller";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

interface IndexDoc {
	message: string;
}

describe("test", () => {
	// declare these partials outside of the test scope so they are available within the closure of the test at all times.
	// A partial is a typescript feature that means the mocked object will be a subset of the object it is pretending to be
	// 		Later on when we pass the mockRequest and mockResponse to the controller we coerce them into their
	// 		type using the (mockRequest as Request), "as" keyword so the controller is happy with the types
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: Partial<NextFunction>;
	let resultStatus: number;
	let resultJson: Partial<IndexDoc>;

	beforeEach(() => {
		// object to create mocked implementations on for express response
		mockResponse = {};

		// reset the result json
		resultJson = {};

		// mock the response status
		// The mockImplementation catches the .status function when it is called in express,
		// 	then runs the below test code to "implement" what the function will do.
		//
		// To test express there is a special requirement, that is to return the "mockResponse" object every time,
		// 		this mimics the "function chaining" behavior of express where we call .status().json({}) in the controller
		//
		// the .mockImplementation((result) => {} "result" variable is given to us by express and represents
		// 		what the controller and express passed to the .status and .json parts of the chain,
		// 		essentially we just steal that and keep it for our assertions later on in the test
		mockResponse.status = jest.fn().mockImplementation((status) => {
			resultStatus = status;
			return mockResponse;
		});

		// mock the response response
		mockResponse.json = jest.fn().mockImplementation((result) => {
			resultJson = result;
			return mockResponse;
		});

		nextFunction = jest.fn();

		// Create a jest function that we can pass as the nextFunction to the controller
		// 		If the controller reaches an error state, then the next() function will be called
		// 		and we will be able to assert that by calling the .toHaveBeenCalledTimes() method
		nextFunction = jest.fn();
	});

	it("returns 200 and the expected json body", () => {
		const controller = new IndexController();
		// run the index controller with the req of {} and wait for the response
		controller.index(mockRequest as Request, mockResponse as Response);

		// when the res.status is called we expect it to be passed 200
		expect(resultStatus).toBe(200);

		// when the res.json is called we expect it to have the body json from the controller
		expect(resultJson).toEqual({ message: "ok" });

		// next should not have been called
		expect(nextFunction).toHaveBeenCalledTimes(0);
	});
});
