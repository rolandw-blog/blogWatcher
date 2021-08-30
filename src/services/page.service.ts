import { Types } from "mongoose";
import HttpException from "../exceptions/HttpException";
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
}

export default PageService;
