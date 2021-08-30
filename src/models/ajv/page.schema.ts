// ======================================================================================================
// Reference interfaces/page.interface.ts to see the structure of how this schema should be constructed
// ======================================================================================================

import { JSONSchemaType } from "ajv";
import IPage, { ISource } from "../../interfaces/page.interface";

// array item from page.source
const source: JSONSchemaType<ISource, false> = {
	type: "object",
	required: ["remote", "url"],
	properties: {
		remote: { type: "boolean" },
		url: { type: "string" },
	},
};

const schema: JSONSchemaType<IPage> = {
	type: "object",
	properties: {
		// name
		name: { type: "string", nullable: false },
		// source
		source: {
			type: "array",
			items: source,
		},
		// path
		path: { type: "array", items: { type: "string" } },
		// meta
		meta: {
			type: "object",
			required: ["template", "hero", "hidden"],
			properties: {
				// template
				template: { type: "string" },
				// hero
				hero: { type: "string" },
				// hidden
				hidden: { type: "boolean" },
			},
		},
	},
	required: ["name", "source", "path", "meta"],
	additionalProperties: false,
};

export default schema;
