import * as joi from "joi";

class AuthValidator {
  public signup = joi.object({
    email: joi
      .string()
      .required()
      .email({ tlds: { allow: ["com", "net"] } }),
    username: joi.string().required().min(4),
    password: joi.string().required().min(6).max(60),
    // .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
    isAdmin: joi.boolean(),
  });

  public signin = joi.object({
    identifier: joi.string().required(),
    password: joi.string().required(),
  });
}

export default new AuthValidator();
