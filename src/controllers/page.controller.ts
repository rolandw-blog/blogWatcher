import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
// import loggerFunction from "../utils/genericLogger";
// const logger = loggerFunction(__filename);
import HttpException from "../exceptions/HttpException";
import PageService from "../services/page.service";
import Controller from "./controller.class";

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

	// returns a lean page object
	public getPageLean = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (req.params["id"] === undefined) {
			throw new HttpException(500, "no ID provided");
		}

		try {
			const unparsed_page_id = req.params["id"] as string;
			if (!Types.ObjectId.isValid(unparsed_page_id)) {
				throw new HttpException(500, "Malformed ID");
			}

			const id = Types.ObjectId(req.params["id"]?.toString());

			const page = await this._service.getPageLean(id);

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
		try {
			// If there was no query params passed
			// This should never really be needed, but better to be safe
			if (Object.keys(req.query).length === 0) {
				const msg = `No query given. Please refer to API documentation for valid query arguments`;
				throw new HttpException(500, msg);
			}

			if (parseInt(req.query["page"] as string) === 0) {
				throw new HttpException(500, "Page number must start at 1");
			}

			// pass the query params to the service to do a construct a query and do a page search
			const pages = await this._service.searchPage(req);
			res.status(200).json(pages);
		} catch (err) {
			next(err);
		}
	};

	public getRecentCreatedPages = async (
		_req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const pages = await this._service.getRecentCreatedPages();
			res.status(200).json(pages);
		} catch (err) {
			next(err);
		}
	};
}

export default PageController;
