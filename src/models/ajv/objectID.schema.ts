import { JSONSchemaType } from "ajv";
import IParamID from "../../interfaces/paramID.interface";

// to validate the ObjectID from mongoose i used this stack overflow post:
// https://stackoverflow.com/questions/65823587/node-validate-request-params-using-ajv

const schema: JSONSchemaType<IParamID> = {
	type: "object",
	required: ["id"],
	properties: {
		id: { type: "string", pattern: "^[a-f\\d]{24}$" },
	},
};

export default schema;
