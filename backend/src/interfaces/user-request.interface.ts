import { Request } from "express";

export interface UserI {
  userId: string;
  isAdmin?: boolean;
}

export interface UserRequestI extends Request {
  user?: UserI;
}
