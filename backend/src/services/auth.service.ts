import { Request, Response } from "express";
import { RootService } from "./_root.service";
import { Status } from "../interfaces/status.interface";
import AuthController from "../controllers/auth.control";

const { SUCCESS, ERROR, CREATED } = Status;

class AuthService extends RootService {
  signup = async (req: Request, res: Response) => {
    try {
      const data = await AuthController.signup(req.body);

      this.sendResponse({
        req,
        res,
        status: CREATED,
        data,
        message: "Signup successful",
      });
    } catch (error) {
      this.sendResponse({
        req,
        res,
        status: ERROR,
        message: error instanceof Error ? error.message : "Signup failed",
      });
    }
  };

  signin = async (req: Request, res: Response) => {
    try {
      const data = await AuthController.signin(req.body);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Signin successful",
      });
    } catch (error) {
      this.sendResponse({
        req,
        res,
        status: ERROR,
        message: error instanceof Error ? error.message : "Signin failed",
      });
    }
  };
}

export default new AuthService();
