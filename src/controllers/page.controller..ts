import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import loggerFunction from "../utils/genericLogger";
const logger = loggerFunction(__filename);
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
	public page = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
			logger.debug("passing to next");
			next(err);
		}
	};
}

export default PageController;
