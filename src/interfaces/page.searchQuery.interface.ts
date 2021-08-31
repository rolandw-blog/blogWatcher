// Contains all the possible search query types

interface pageSearchQuery {
	name?: string;
	template?: string;
	// when these come from express query params they are strings
	page?: string;
	limit?: string;
}

export default pageSearchQuery;
