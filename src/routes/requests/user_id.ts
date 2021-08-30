import { JSONSchemaType } from "ajv";

type UserRequest = {
	id: string;
};

// the "UserRequest" of type JSONSchemaType<UserRequest> is used by JSONSchemaType as a "generic"
// A generic is a way of capturing a user passed in Type (<UserRequest>) that JSONSchemaType can use internally.
// JSONSchemaType will be defined in the Ajv library as something like `interface JSONSchemaType<Type> {...}`
// 		Now JSONSchemaType can use the <UserRequest> type. EG. interface JSONSchemaType<Type> { myArg: Type }
// You can also use generics for functions and classes https://www.typescriptlang.org/docs/handbook/2/generics.html
const schema: JSONSchemaType<UserRequest> = {
	type: "object",
	properties: {
		id: { type: "string", nullable: false },
	},
	required: ["id"],
	additionalProperties: false,
};

// We can now use this schema in the middleware of routes/user.route.ts to validate that a user request is an object that matches...
// {
//  id: string
// }
export default schema;
export { UserRequest };
