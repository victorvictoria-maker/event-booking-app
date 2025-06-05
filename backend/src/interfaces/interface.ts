import { Status } from "./status.interface";
import { Request, Response } from "express";
export interface SampleI {
  _id: string;
  name: string;
  description?: string;
  createdAt: number;
}
export interface ServiceRespI {
  req: Request;
  res: Response;
  status: Status;
  request?: Request;
  actionType?: string;
  data?: any;
  message?: string;
  error?: any;
  admin_message?: string;
}

export interface FiltersQueryI {
  filterSet: {
    field: string;
    operator: "contains" | "does_not_contain" | "is" | "is_not";
    value: string;
  }[];
  conjunction: "or" | "and";
}
