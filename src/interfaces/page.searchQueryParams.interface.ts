// Contains all the possible search query types when searching for a page through an API request (URL query params)

interface IPageSearchQuery {
	// only accept ?id and not ?_id when querying through a url like ?id=123
	id?: string;
	name?: string;
	template?: string;
	path?: string;
	// pagination: when these come from express query params they are strings
	page?: string;
	limit?: string;
}

export default IPageSearchQuery;
