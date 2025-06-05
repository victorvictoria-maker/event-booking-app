import { Router } from "express";
import AuthService from "../services/auth.service";
import Joi from "../middlewares/validator.middleware";
import authValidator from "../validations/auth.validator";

class AuthRoute {
  public loadRoutes(prefix: string, router: Router) {
    this.signUp(prefix, router);
    this.signIn(prefix, router);
  }

  private signUp(prefix: string, router: Router) {
    router.post(
      `${prefix}/signup`,
      Joi.validator(authValidator.signup),
      AuthService.signup
    );
  }

  private signIn(prefix: string, router: Router) {
    router.post(
      `${prefix}/signin`,
      Joi.validator(authValidator.signin),
      AuthService.signin
    );
  }
}

export default new AuthRoute();
