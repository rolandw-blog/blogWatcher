// This file contains validation for all the possible queries that can be made when searching for pages.

import { JSONSchemaType } from "ajv";
import pageSearchQuery from "../../interfaces/page.searchQueryParams.interface";

const schema: JSONSchemaType<pageSearchQuery> = {
	type: "object",
	required: [],
	additionalProperties: false,
	nullable: true,
	properties: {
		name: { type: "string", nullable: true },
		template: { type: "string", nullable: true },
		path: { type: "string", nullable: true },
		page: { type: "string", nullable: true },
		limit: { type: "string", nullable: true },
	},
};

export default schema;
