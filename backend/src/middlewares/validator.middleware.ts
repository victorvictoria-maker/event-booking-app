import * as joi from "joi";
import { RootService } from "../services/_root.service";
import { Status } from "../interfaces/status.interface";
const { FAILED_VALIDATION } = Status;
import { Request, Response, NextFunction } from "express";
/**
 * Validation middleware that uses joi to validate the request body.
 * @param schema Joi schema to use to validate the request body
 */
export class Joi extends RootService {
  validator(schema: joi.Schema, field: "body" | "query" = "body") {
    return async (req: Request, res: Response, next: NextFunction) => {
      const actionType = "SCHEMA_VALIDATION";
      try {
        await schema.validateAsync(req[field], { abortEarly: false });
        next();
      } catch (err: any) {
        const errorDetails = err.details.map((e: any) => e.message);
        const response = {
          message: "Some validation errors occurred",
          errors: errorDetails,
        };
        return this.sendResponse({
          req,
          res,
          status: FAILED_VALIDATION,
          actionType,
          data: response,
        });
      }
    };
  }
}
const newJoi = new Joi();
export default newJoi;
