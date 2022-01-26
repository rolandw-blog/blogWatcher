// This file contains validation for all the possible queries that can be made when searching for pages.

import { JSONSchemaType } from "ajv";
import pageSearchQuery from "../../interfaces/page.searchQueryParams.interface";

const schema: JSONSchemaType<pageSearchQuery> = {
	type: "object",
	required: [],
	additionalProperties: false,
	nullable: true,
	properties: {
		id: { type: "string", pattern: "^[a-f\\d]{24}$", nullable: true },
		name: { type: "string", nullable: true },
		template: { type: "string", nullable: true },
		path: { type: "string", nullable: true },
		page: { type: "string", pattern: "^[1-9]+$" },
		limit: { type: "string", pattern: "^([1-9][0-9]{0,2}|-1)$" },
	},
};

export default schema;
