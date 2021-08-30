import { JSONSchemaType } from "ajv";
import ID from "../../interfaces/id.interface";

// to validate the ObjectID from mongoose i used this stack overflow post:
// https://stackoverflow.com/questions/65823587/node-validate-request-params-using-ajv

const schema: JSONSchemaType<ID> = {
	type: "object",
	required: ["id"],
	properties: {
		id: { type: "string", pattern: "^[a-f\\d]{24}$" },
	},
};

export default schema;
