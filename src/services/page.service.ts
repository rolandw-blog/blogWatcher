import { Types } from "mongoose";
import HttpException from "../exceptions/HttpException";
import IPage from "../interfaces/page.interface";
import { IPageModel, IPageDocument } from "../models/mongoose/page.schema";
import IPagePaginationParams from "../interfaces/page.pagination.interface";
import IPageQueryParams from "../interfaces/page.query.interface";

// quick compare function to sort by page name
function compare(a: IPage, b: IPage): -1 | 0 | 1 {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
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
		const page = await this.model.findById(id).exec();
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

	async searchPage(
		query: IPageQueryParams,
		pagination: IPagePaginationParams
	): Promise<IPageDocument[]> {
		// this type of pagniation is not great (IO limited at scale) but it works for now
		const { page, limit } = pagination;
		try {
			const pages = await this.model
				.find(query as never)
				.limit(limit)
				.skip((page - 1) * limit)
				.exec();
			return pages.sort(compare);
		} catch (err) {
			throw new HttpException(500, "Something went wrong searching for pages");
		}
	}
}

export default PageService;
