import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import dotenv from "dotenv";
// import { Types } from "mongoose";
// import HttpException from "../exceptions/HttpException";
import { IPageDocument } from "../models/mongoose/page.schema";
import PageService from "../services/page.service";
import PageController from "../controllers/page.controller.";
import HttpException from "../exceptions/HttpException";
dotenv.config();

// here we mock what the service will return when we call the getUser method
const searchPageMock = (): jest.Mock => {
	return jest.fn().mockImplementation(() => {
		return Promise.resolve([
			{
				meta: { template: "blogPost.ejs", hero: "hero value", hidden: false },
				path: ["deleteMe", "test1"],
				_id: "612db903ee1fd0e410fe1db5",
				name: "testPage1",
				source: [
					{
						url: "https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Linux/Apt%20Package%20Manager.md",
						remote: true,
					},
				],
			},
		]);
	});
};

describe("test page controller (search method)", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: Partial<NextFunction>;
	let service: Partial<PageService>;
	let resultStatus: number;
	let resultJson: Array<Partial<IPageDocument>>;

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
			searchPage: jest.fn(),
		};

		// reset the result json
		resultJson = [{}];

		// mock the response status
		mockResponse.status = jest.fn().mockImplementation((status) => {
			resultStatus = status;
			return mockResponse;
		});

		// mock the response json
		mockResponse.json = jest.fn().mockImplementation((result) => {
			resultJson = result;
			return mockResponse;
		});

		nextFunction = jest.fn();
	});

	afterEach(() => {
		// reset counters on stuff like toHaveBeenCalledTimes
		jest.clearAllMocks();
	});

	test("search returns correct object by name with pagination", async () => {
		// here we mock what the service will return when we call the getUser method
		service.searchPage = searchPageMock();

		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new PageController(service as PageService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = { query: { name: "testPage", page: "1", limit: "1" } };

		// we call the search method on the controller
		await controller.searchPage(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we called searchPage on our service
		expect(service.searchPage).toHaveBeenCalledTimes(1);

		// check that the service searchPage method was called with the things
		expect(service.searchPage).toHaveBeenCalledWith(
			{ name: new RegExp("testPage", "i") },
			{ page: 1, limit: 1 }
		);

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(0);

		// check that the status was called and set to 200
		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(resultStatus).toBe(200);

		// check the object returned
		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(resultJson.length).toBe(1);
		expect(resultJson[0]).toBeDefined();
		expect(resultJson[0]?.name).toBe("testPage1");
		expect(resultJson[0]?._id).toBe("612db903ee1fd0e410fe1db5");
	});

	test("search returns correct object by template with pagination", async () => {
		// here we mock what the service will return when we call the getUser method
		service.searchPage = searchPageMock();

		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new PageController(service as PageService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = { query: { template: "blogPost.ejs", page: "1", limit: "1" } };

		// we call the search method on the controller
		await controller.searchPage(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we called searchPage on our service
		expect(service.searchPage).toHaveBeenCalledTimes(1);

		// check that the service searchPage method was called with the things
		expect(service.searchPage).toHaveBeenCalledWith(
			{ "meta.template": "blogPost.ejs" },
			{ page: 1, limit: 1 }
		);

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(0);

		// check that the status was called and set to 200
		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(resultStatus).toBe(200);

		// check the object returned
		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(resultJson.length).toBe(1);
		expect(resultJson[0]).toBeDefined();
		expect(resultJson[0]?.name).toBe("testPage1");
		expect(resultJson[0]?._id).toBe("612db903ee1fd0e410fe1db5");
	});

	test("search returns correct object by name with no pagination settings", async () => {
		// here we mock what the service will return when we call the getUser method
		service.searchPage = searchPageMock();

		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new PageController(service as PageService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = { query: { name: "testPage" } };

		// we call the search method on the controller
		await controller.searchPage(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we called searchPage on our service
		expect(service.searchPage).toHaveBeenCalledTimes(1);

		// check that the service searchPage method was called with the things
		expect(service.searchPage).toHaveBeenCalledWith(
			{ name: new RegExp("testPage", "i") },
			{ page: 1, limit: 3 } // defaults from the controller should be used
		);

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(0);

		// check that the status was called and set to 200
		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(resultStatus).toBe(200);

		// check the object returned
		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(resultJson.length).toBe(1);
		expect(resultJson[0]).toBeDefined();
		expect(resultJson[0]?.name).toBe("testPage1");
		expect(resultJson[0]?._id).toBe("612db903ee1fd0e410fe1db5");
	});

	test("search returns correct object by template with no pagination settings", async () => {
		// here we mock what the service will return when we call the getUser method
		service.searchPage = searchPageMock();

		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new PageController(service as PageService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = { query: { template: "blogPost.ejs" } };

		// we call the search method on the controller
		await controller.searchPage(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we called searchPage on our service
		expect(service.searchPage).toHaveBeenCalledTimes(1);

		// check that the service searchPage method was called with the things
		expect(service.searchPage).toHaveBeenCalledWith(
			{ "meta.template": "blogPost.ejs" },
			{ page: 1, limit: 3 } // defaults from the controller should be used
		);

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(0);

		// check that the status was called and set to 200
		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(resultStatus).toBe(200);

		// check the object returned
		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(resultJson.length).toBe(1);
		expect(resultJson[0]).toBeDefined();
		expect(resultJson[0]?.name).toBe("testPage1");
		expect(resultJson[0]?._id).toBe("612db903ee1fd0e410fe1db5");
	});

	test("search will not accept garbage query", async () => {
		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new PageController(service as PageService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = { query: { garbage: "danger" } };

		// we call the search method on the controller
		await controller.searchPage(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we did not called searchPage on our service
		expect(service.searchPage).toHaveBeenCalledTimes(0);

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(1);
		expect(nextFunction).toHaveBeenCalledWith(
			new HttpException(500, "Unsorted query params are not supported. Please remove garbage")
		);
	});

	test("search handles multiple queries (name and template)", async () => {
		// here we mock what the service will return when we call the getUser method
		service.searchPage = searchPageMock();

		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new PageController(service as PageService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = { query: { template: "blogPost.ejs", name: "testPage" } };

		// we call the search method on the controller
		await controller.searchPage(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we called searchPage on our service
		expect(service.searchPage).toHaveBeenCalledTimes(1);

		// check that the service searchPage method was called with the things
		expect(service.searchPage).toHaveBeenCalledWith(
			{ "meta.template": "blogPost.ejs", name: new RegExp("testPage", "i") },
			{ page: 1, limit: 3 } // defaults from the controller should be used
		);

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(0);

		// check that the status was called and set to 200
		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(resultStatus).toBe(200);

		// check the object returned
		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(resultJson.length).toBe(1);
		expect(resultJson[0]).toBeDefined();
		expect(resultJson[0]?.name).toBe("testPage1");
		expect(resultJson[0]?._id).toBe("612db903ee1fd0e410fe1db5");
	});

	test("search with no query", async () => {
		// next we create the controller and pass in the mocked service
		// the mocked service will be used to call the getUser method internally
		const controller = new PageController(service as PageService);

		// we modify the params object to have the id of the user we want to get from the mocked service "database"
		mockRequest = {};

		// we call the search method on the controller
		await controller.searchPage(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction as NextFunction
		);

		// check that we did not called searchPage on our service
		expect(service.searchPage).toHaveBeenCalledTimes(0);

		// check that next was not called (no error to report)
		expect(nextFunction).toHaveBeenCalledTimes(1);
		expect(nextFunction).toHaveBeenCalledWith(
			new HttpException(
				500,
				"No query given. Please refer to API documentation for valid query arguments"
			)
		);
	});
});
