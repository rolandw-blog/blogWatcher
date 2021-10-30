// Construct a search query for a database service
// Should take a query object from express (req.query) and return a service friendly mongo query
// =================================================================================================
import { Request } from "express";
import HttpException from "../../exceptions/HttpException";
import IPagePaginationParams from "../../interfaces/page.pagination.interface";
import IPageQueryParams, { IndexedPath } from "../../interfaces/page.query.interface";
// import genericLogger from "../../utils/genericLogger";
// const logger = genericLogger(__filename);

function handlePath(path: string, queryParams: IPageQueryParams): void {
	// =============================================================================================
	// Valid queries:
	// /pages?path=/notes/*&page=1
	// /pages?path=/notes/&limit=1
	// =============================================================================================

	// the purpose of the .filter method is to remove empty strings
	// EG: ["", "aaa", "bbb"] will become ["aaa", "bbb"]
	//       \_empty string is removed
	const pathSegments = path.split("/").filter((segment) => segment !== "");

	// 0 = the page(s) that matches this path exactly
	// 1 = children of the path given
	let drillDown = 0;

	// double wildcard /** = all recursive children and siblings
	// single wildcard /* = all direct children
	let sign = "$eq";
	if (pathSegments[pathSegments.length - 1] === "*") {
		// if the last segment is a wildcard, we will use the +1 for the path length to get its children
		drillDown = 1;
		// pop the last segment off the array
		pathSegments.pop();
	} else if (pathSegments[pathSegments.length - 1] === "**") {
		drillDown = 1;
		sign = "$gte";
		pathSegments.pop();
	} else if (pathSegments.length === 0) {
		// if there are no path segments, we will use the +1 for the path length to get its children
		drillDown = 0;
	}

	// if there are any path segments, we will use them to build the query
	if (pathSegments.length > 0) {
		// append {path.n: "value"} to the query where n is the index of the segment in the path
		for (let i = 0; i < pathSegments.length; i++) {
			// add a new property to the queryParams object
			queryParams[`path.${i}`] = pathSegments[i] as IndexedPath;
		}

		// set the filter "meta.pathLength" which will be "gte|eq|lte: number"
		queryParams["meta.pathLength"] = {
			[sign]: pathSegments.length + drillDown,
		};
	} else {
		// looking for root path
		queryParams["meta.pathLength"] = {
			[sign]: pathSegments.length + drillDown,
		};
	}
}

function handleId(idToSearchFor: string, queryParams: Partial<IPageQueryParams>): void {
	// assign the name as a filter for the queryParams object
	Object.defineProperty(queryParams, "_id", {
		value: idToSearchFor,
		writable: false,
	});
}

function handleName(nameToSearchFor: string, queryParams: Partial<IPageQueryParams>): void {
	// create a regex (will become a string)
	const queryStringForName = new RegExp(nameToSearchFor, "i");

	// assign the name as a filter for the queryParams object
	Object.defineProperty(queryParams, "name", {
		value: queryStringForName,
		writable: false,
		enumerable: true,
	});
}

function handleTemplate(templateToSearchFor: string, queryParams: Partial<IPageQueryParams>): void {
	// assign the template as a filter for the queryParams object
	// mongoose takes nested queries like this: { "meta.template": "test" }
	// not: { "meta": { "template": "test" } }
	Object.defineProperty(queryParams, "meta.template", {
		value: templateToSearchFor,
		writable: false,
		enumerable: true,
	});
}

function handlePage(pageNumber: number, paginationParams: IPagePaginationParams): void {
	paginationParams.page = pageNumber;
}

function handleLimit(numberOfPages: number, paginationParams: IPagePaginationParams): void {
	if (numberOfPages === -1) {
		paginationParams.limit = 999999999;
	} else {
		paginationParams.limit = numberOfPages;
	}
}

function processQueryParam(key: string, req: Request, queryParams: IPageQueryParams) {
	// if the key is a query param, we will assign it to the queryParams object
	switch (key) {
		case "name":
			handleName((req.query["name"] as string) || "^.*", queryParams);
			break;
		case "template":
			handleTemplate((req.query["template"] as string) || "", queryParams);
			break;
		case "id":
			handleId((req.query["_id"] as string) || "aaaaaaaaaaaaaaaaaaaaaaaa", queryParams);
			break;
		case "path":
			handlePath((req.query["path"] as string) || "/", queryParams);
	}
}

function processPaginationParam(
	key: string,
	req: Request,
	paginationParams: IPagePaginationParams
) {
	switch (key) {
		case "page": {
			// check page is a number
			if (Number.isInteger(parseInt(req.query["page"] as string))) {
				// set the page, fall back on 0
				const tmp = Number.parseInt(req.query["page"] as string) || 0;
				handlePage(tmp, paginationParams);
			} else {
				handlePage(1, paginationParams);
			}
			break;
		}
		case "limit": {
			// check limit is a number
			if (Number.isInteger(parseInt(req.query["limit"] as string))) {
				// set the limit, fall back on 1
				const tmp = Number.parseInt(req.query["limit"] as string) || 10;
				handleLimit(tmp, paginationParams);
			} else {
				handleLimit(1, paginationParams);
			}
			break;
		}
	}
}

type returnType = {
	queryParams: IPageQueryParams;
	paginationParams: IPagePaginationParams;
};

function constructSearchQuery(req: Request): returnType {
	const queryParams: IPageQueryParams = {};

	const paginationParams: IPagePaginationParams = {
		page: 1,
		limit: 10,
	};

	// sort through which params we will use to build the query and pagination for mongoose
	for (const key in req.query) {
		// if its a query
		if (key === "path" || key === "name" || key === "template" || key === "id") {
			processQueryParam(key, req, queryParams);
		}
		// if its a pagination
		else if (key === "page" || key === "limit") {
			processPaginationParam(key, req, paginationParams);
		} else {
			// throw an error, we dont want to use this param
			throw new HttpException(418, `Please remove ${key}`);
		}
	}

	return { queryParams, paginationParams };
}

export default constructSearchQuery;
