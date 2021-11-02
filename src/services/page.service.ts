import { LeanDocument, Types } from "mongoose";
import HttpException from "../exceptions/HttpException";
import IPage from "../interfaces/page.interface";
import { IPageModel, IPageDocument } from "../models/mongoose/page.schema";
import constructSearchQuery from "./common/constructSearchQuery";
import { Request } from "express";
import genericLogger from "../utils/genericLogger";
const logger = genericLogger(__filename);

// quick compare function to sort by page name
function compare(a: IPage, b: IPage): -1 | 0 | 1 {
	if (a.meta.template === "menu.ejs") {
		return -1;
	} else if (b.meta.template === "menu.ejs") {
		return 1;
	} else if (a.name < b.name) {
		return -1;
	} else if (a.name > b.name) {
		return 1;
	}
	return 0;
}
class PageService {
	public model: IPageModel;

	constructor(model: IPageModel) {
		this.model = model;
	}

	async getPage(id: Types.ObjectId): Promise<IPageDocument> {
		const page = await this.model.findById(id, { "meta.hidden": false }).exec();
		if (page === null) {
			throw new HttpException(404, "Page was not found");
		} else {
			return page;
		}
	}

	async getPageLean(id: Types.ObjectId): Promise<LeanDocument<IPageDocument>> {
		const page = await this.model.findById(id, { "meta.hidden": false }).lean();
		if (page === null) {
			throw new HttpException(404, "Page was not found");
		} else {
			return page;
		}
	}

	async postPage(doc: IPage): Promise<IPageDocument> {
		try {
			const page = new this.model(doc);
			return await page.save();
		} catch (err) {
			throw new HttpException(500, "Something went wrong uploading the page");
		}
	}

	async searchPage(req: Request): Promise<IPageDocument[]> {
		// this type of pagniation is not great (IO limited at scale) but it works for now
		const formedQuery = constructSearchQuery(req);
		const { queryParams } = formedQuery;
		const { paginationParams } = formedQuery;
		const { limit, page } = paginationParams;
		logger.debug(`searchPage: queryParams: ${JSON.stringify(queryParams)}`);

		try {
			const pages = await this.model
				.find({ ...queryParams, "meta.hidden": false } as never)
				.limit(limit)
				.skip((page - 1) * limit)
				.sort({ _id: -1 })
				// .limit(1)
				.exec();
			return pages.sort(compare);
		} catch (err) {
			throw new HttpException(500, "Something went wrong searching for pages");
		}
	}

	async getRecentCreatedPages(): Promise<IPageDocument[]> {
		try {
			const pages = await this.model
				.find({ "meta.hidden": false } as never)
				.sort({ _id: 1 })
				.limit(5)
				.exec();
			return pages.sort(compare);
		} catch (err) {
			throw new HttpException(500, "Something went wrong searching for pages");
		}
	}
}

export default PageService;
