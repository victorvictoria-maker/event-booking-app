import { winston } from "../utilities/logger.util";
import { Status } from "../interfaces/status.interface";
import { ServiceRespI } from "../interfaces/interface";

export class RootService {
  sendResponse = (serviceResponse: ServiceRespI): any => {
    let { res, status, data, message, error } = serviceResponse;
    try {
      status = status || Status.ERROR;
      const code = error && error.code ? error.code : null;
      const response: any = { status, data, message, code };
      if (error) {
        response.error = this.get_error_(error);
      }

      const status_code = this.getHttpStatus(status);
      res.status(status_code).json(response);
      if (status_code >= 400) {
        const dataErr = data ? JSON.stringify(data) : data;
        const error = `["App Error"}] ${response.message} ${dataErr}`;
        winston.error(error);
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ status: "ERROR", data: error, message: error.message });
    }
  };
  get_error(error: any): { status: Status; message: string; data: any } {
    let response = {
      status: Status.ERROR,
      message: "Request failed",
      data: null,
    };
    const { status, message, data } = error;
    response.status = status ? status : response.status;
    response.message = message ? message : response.message;
    response.data = data ? data : response.data;
    return response;
  }
  private getHttpStatus(status: any): number {
    switch (status) {
      case "SUCCESS":
      case "PROCESSING":
        return 200;
      case "CREATED":
        return 201;
      case "SUCCESS_NO_CONTENT":
        return 204;
      case "FAILED_VALIDATION":
        return 400;
      case "UN_AUTHORIZED":
        return 401;
      case "FORBIDDEN":
        return 403;
      case "NOT_FOUND":
        return 404;
      case "CONFLICT":
        return 409;
      case "UNPROCESSABLE_ENTRY":
        return 422;
      case "UNATHORIZED":
        return 401;
      case "PRECONDITION_FAILED":
        return 412;
      case "ERROR":
        return 500;
      default:
        return 400;
    }
  }
  private get_error_ = (err: any) => {
    const error = err && err.error ? err.error : err;
    const { req, message, status, code, ...err_rest } = error;
    return err_rest;
  };
}
