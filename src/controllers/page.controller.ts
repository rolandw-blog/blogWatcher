import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
// import loggerFunction from "../utils/genericLogger";
// const logger = loggerFunction(__filename);
import HttpException from "../exceptions/HttpException";
import PageService from "../services/page.service";
import Controller from "./controller.class";
import IPagePaginationParams from "../interfaces/page.pagination.interface";
import IPageQueryParams from "../interfaces/page.query.interface";
import { IQueryPathIndex } from "../interfaces/page.query.interface";

class PageController extends Controller<PageService> {
	private _service: PageService;

	// a service is a class from ./services the has functionality to interact with the database
	// the service requires a model to be passed to it after it has been registered
	constructor(service: PageService) {
		super(service);
		this._service = service;
	}

	// returns a page object
	public getPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (req.params["id"] === undefined) {
			throw new HttpException(500, "no ID provided");
		}

		try {
			const unparsed_page_id = req.params["id"] as string;
			if (!Types.ObjectId.isValid(unparsed_page_id)) {
				throw new HttpException(500, "Malformed ID");
			}

			const id = Types.ObjectId(req.params["id"]?.toString());

			const page = await this._service.getPage(id);

			if (page) {
				// the service should throw an error if no page is found
				res.status(200).json(page);
			} else {
				throw new HttpException(500, "Something went wrong");
			}
		} catch (err) {
			next(err);
		}
	};

	// uploads a page
	public postPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const page = await this._service.postPage(req.body);

			if (page) {
				res.status(200).json(page);
			} else {
				throw new HttpException(500, "Something went wrong");
			}
		} catch (err) {
			next(err);
		}
	};

	public searchPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const queryParams: Partial<IPageQueryParams> = {};
		const paginationParams: Partial<IPagePaginationParams> = {};
		// const queryPathSegments: IQuertPathSegments = {};
		const unsorted = [];

		// sort through which params we will use to build the query and pagination for mongoose
		for (const key in req.query) {
			switch (key) {
				case "name":
					queryParams["name"] = new RegExp((req.query[key] as string) || "^.*", "i");
					break;
				case "template":
					// mongoose takes nested queries like this: { "meta.template": "test" }
					// not: { "meta": { "template": "test" } }
					queryParams["meta.template"] = req.query[key] as string;
					break;
				case "page":
					paginationParams.page = parseInt(req.query[key] as string) as number;
					break;
				case "limit":
					paginationParams.limit = parseInt(req.query[key] as string) as number;
					break;
				case "path": {
					const path = req.query[key] as string;
					// the purpose of filter it to remove empty strings
					const pathSegments = path.split("/").filter((segment) => segment !== "");

					// if there are any path segments, we will use them to build the query
					if (pathSegments.length >= 1) {
						// append {path.n: "value"} to the query where n is the index of the segment in the path
						for (let i = 0; i < pathSegments.length; i++) {
							queryParams[(`path.` + i) as IQueryPathIndex] = pathSegments[i];
						}

						// an array of exactly the same length as the path segments
						// +1 for siblings of the path given
						// +2 for siblings and children of the path given
						queryParams[("path." + pathSegments.length + 1) as IQueryPathIndex] = {
							$exists: false,
						};
					} else {
						// failsafe if the query is "example.com?path" and no value was passed in
						queryParams["path.0"] = "";
						// an array of exactly 1 index
						queryParams["path.1"] = { $exists: false };
					}
					break;
				}
				default:
					unsorted.push({ [key]: req.query[key] });
					break;
			}
		}

		// set defaults for the pagination if they are not set
		if (paginationParams["page"] === undefined) paginationParams["page"] = 1;
		if (paginationParams["limit"] === undefined) paginationParams["limit"] = 3;

		try {
			// if there was some incorrect filters passed in then throw an error
			if (unsorted.length > 0) {
				const valuesToRemove = unsorted.map((obj) => Object.keys(obj)[0]);
				const msg = `Unsorted query params are not supported`;
				throw new HttpException(500, `${msg}. Please remove ${valuesToRemove.join(", ")}`);
			}

			// if there was no query params passed
			if (Object.keys(queryParams).length === 0) {
				const msg = `No query given. Please refer to API documentation for valid query arguments`;
				throw new HttpException(500, msg);
			}

			// search for pages
			const pages = await this._service.searchPage(
				queryParams,
				paginationParams as IPagePaginationParams
			);
			res.status(200).json(pages);
		} catch (err) {
			next(err);
		}
	};
}

export default PageController;
