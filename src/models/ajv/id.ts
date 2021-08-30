import { JSONSchemaType } from "ajv";
import ID from "../../interfaces/id.interface";

// the "ParamID" of type JSONSchemaType<ParamID> is used by JSONSchemaType as a "generic"
// A generic is a way of capturing a user passed in Type (<ParamID>) that JSONSchemaType can use internally.
// JSONSchemaType will be defined in the Ajv library as something like `interface JSONSchemaType<Type> {...}`
// 		Now JSONSchemaType can use the <ParamID> type. EG. interface JSONSchemaType<Type> { myArg: Type }
// You can also use generics for functions and classes https://www.typescriptlang.org/docs/handbook/2/generics.html
const schema: JSONSchemaType<ID> = {
	type: "object",
	properties: {
		id: { type: "string", nullable: false },
	},
	required: ["id"],
	additionalProperties: false,
};

// We can now use this schema in the middleware of routes/user.route.ts to validate that a user request is an object that matches...
export default schema;
