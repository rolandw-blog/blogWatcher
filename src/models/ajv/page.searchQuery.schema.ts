import { JSONSchemaType } from "ajv";
import pageSearchQuery from "../../interfaces/page.searchQuery.interface";

// const schema: JSONSchemaType<pageSearchQuery> = {
// 	type: "object",
// 	required: [],
// 	anyOf: [{ properties: { name: { type: "string", minLength: 1, maxLength: 50 } } }],
// 	properties: {
// 		name: { type: "string", minLength: 1, maxLength: 50 },
// 	},
// };

const schema: JSONSchemaType<pageSearchQuery> = {
	type: "object",
	minProperties: 1,
	required: [],
	additionalProperties: false,
	properties: {
		name: { type: "string", minLength: 1, maxLength: 50 },
	},
};

export default schema;
