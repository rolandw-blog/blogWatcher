import UserController from "../controllers/user.controller";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import dotenv from "dotenv";
import { IUserDocument } from "../models/mongoose/User.schema";
import UserService from "../services/user.service";
import { Types } from "mongoose";
import HttpException from "../exceptions/HttpException";
dotenv.config();

describe("test", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: Partial<NextFunction>;
	let service: Partial<UserService>;
	let resultStatus: number;
	let resultJson: Partial<IUserDocument>;

	beforeEach(() => {
		// object to create mocked implementations on for express response
		mockResponse = {};

		// =========== mock service =============================================================
		// our service is a class that uses the mongoose model to abstract requests to the database
		// we create the mock service instead of calling `new UserService(model: IUserModel);`
		service = {
			// the service has methods that we define like getUser which internally calls the findById method on the mongoose model
			// however we can avoid that internal call by defining a mock implementation by skipping it and replacing it with our own jest.fn() mock
			// we will later add implementation in each test based on what we want getUser to return from the "database"
			getUser: jest.fn(),
		};

		// reset the result json
		resultJson = {};

		// mock the response status
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
	});

	it("returns user object", async () => {
		// here we mock what the service will return when we call the getUser method
		service.getUser = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				_id: "6120e4deee1fd0e410fe1d58",
				name: "roland",
				likes: "chocolate",
			});
		});

		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new UserController(service as UserService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = { params: { id: "6120e4deee1fd0e410fe1d58" } };

		// we call the user method on the controller
		// the controller will call the getUser method on the service
		// the service will call the findById method on the mongoose model
		// the mongoose model (which is mocked) will return the user object
		// the controller will then return the user object to the user
		await controller.user(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we called getUser on our service
		expect(service.getUser).toHaveBeenCalledTimes(1);

		// check that the getUser method was called with the correct id
		expect(service.getUser).toHaveBeenCalledWith(Types.ObjectId("6120e4deee1fd0e410fe1d58"));

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(0);

		// check that the status was called and set to 200
		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(resultStatus).toBe(200);

		// check the object returned
		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(resultJson).toBeDefined();
		expect(resultJson.name).toBe("roland");
		expect(resultJson._id).toBe("6120e4deee1fd0e410fe1d58");
		expect(resultJson.likes).toBe("chocolate");
	});

	afterEach(() => {
		// reset counters on stuff like toHaveBeenCalledTimes
		jest.clearAllMocks();
	});

	it("handles malformed user id", async () => {
		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new UserController(service as UserService);

		// this is an invalid ID
		mockRequest.params = { id: "111" };

		await controller.user(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we have NOT called getUser on our service because the ID is invalid
		expect(service.getUser).toHaveBeenCalledTimes(0);

		expect(nextFunction).toHaveBeenCalledTimes(1);
		expect(nextFunction).toBeCalledWith(new HttpException(500, "Malformed ID"));

		// check that nothing weird was sent back.
		// this test isnt great because the empty object is not really representative of what the controller would return in this situation()
		// instead the HTTP error middleware would catch the error and generate some error response json to send back
		// but because we are not actually testing the error middleware we dont care here about the response that much
		expect(resultJson).toMatchObject({});
	});

	it("handles user id that does not exist", async () => {
		service.getUser = jest.fn().mockImplementation(() => {
			throw new HttpException(404, "User not found");
			// you could also write
			// return Promise.reject(new HttpException(404, "User not found"));
		});

		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new UserController(service as UserService);

		// this is an invalid ID
		mockRequest.params = { id: "111111111111111111111111" };

		await controller.user(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we called getUser on our service
		expect(service.getUser).toHaveBeenCalledTimes(1);
		expect(service.getUser).toHaveBeenCalledWith(Types.ObjectId("111111111111111111111111"));

		// check that next called with the 404 error
		expect(nextFunction).toHaveBeenCalledTimes(1);
		expect(nextFunction).toHaveBeenCalledWith(new HttpException(404, "User not found"));
	});
});
