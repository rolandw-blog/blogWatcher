// Contains all the possible search query types when searching for a page through an API request (URL query params)

interface IPageSearchQuery {
	name?: string;
	template?: string;
	path?: string;
	// pagination: when these come from express query params they are strings
	page?: string;
	limit?: string;
}

export default IPageSearchQuery;
