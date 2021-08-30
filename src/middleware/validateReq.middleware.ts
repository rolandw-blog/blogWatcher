import { NextFunction, Request, Response, RequestHandler } from "express";
import { ValidateFunction } from "ajv";
import HttpException from "../exceptions/HttpException";

type Value = "body" | "query" | "params";

// when we call this we need to tell it the type for the validate function
// for example in user.route.ts: `validateRequest<UserRequest>("params", new Ajv().compile(mySchema);)`
function validationMiddleware<Type>(
	value: Value,
	validate: ValidateFunction<Type>
): RequestHandler {
	// This is sort of like a factory pattern that returns some middleware function that can validate any <Type> of schema passed to it.
	return (req: Request, _: Response, next: NextFunction) => {
		// run a validation check of the request ("body"/"query"/"params") against the schema we gave it
		if (validate(req[value])) next();
		else next(new HttpException(400, `wrong ${value} from validate middleware`));
	};
}

export default validationMiddleware;
