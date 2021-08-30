import { Types } from "mongoose";
import HttpException from "../exceptions/HttpException";
import IPage from "../interfaces/page.interface";
import { IPageModel, IPageDocument } from "../models/mongoose/page.schema";

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
}

export default PageService;
