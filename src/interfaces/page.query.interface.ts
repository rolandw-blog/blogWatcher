// These are all the valid query parameters when searching for a page with MONGOOSE
// Note that there is another type of pagination, which is seperate because pagination is generated by the server if required

// Used in the IPageQuery interface below to provide types for the allowed meta.pathLength values
type pathLength = { $gte?: number; $lte?: number; $eq?: number };

type IQueryPathIndex =
	| "path.0"
	| "path.1"
	| "path.2"
	| "path.3"
	| "path.4"
	| "path.5"
	| "path.6"
	| "path.7"
	| "path.8"
	| "path.9"
	| "path.10";

interface IPageQueryParams {
	// page.searchQueryParams.interface.ts takes only ?id
	_id?: string;
	name?: RegExp;
	// this is how mongoose stores nested objects for queries
	// dont use ?meta.template=templateName
	// instead use ?template=templateName and the controller will transform it for you
	"meta.template"?: string;
	// similar to above, but for the path
	// the path length is set through the controller with a wildcard
	// EG ?path = /my/path/here/* will match { eq: 3 } (paths of length 3)
	// EG ?path = /my/path/here will match { eq: 2 } (paths of length 2)
	"meta.pathLength"?: pathLength;
	"path.0"?: string;
	"path.1"?: string;
	"path.2"?: string;
	"path.3"?: string;
	"path.4"?: string;
	"path.5"?: string;
	"path.6"?: string;
	"path.7"?: string;
	"path.8"?: string;
	"path.9"?: string;
	"path.10"?: string;
}

export { IQueryPathIndex };
export default IPageQueryParams;
