import { RootController } from "./_root.control";
import UserModel from "../models/auth.model";
import PasswordUtil from "../utilities/password.util";
import tokenUtil from "../utilities/token.util";

class AuthController extends RootController {
  constructor() {
    super(UserModel, "User");
  }

  async signup(data: {
    email: string;
    password: string;
    username: string;
    isAdmin: boolean;
  }) {
    const { email, password, username, isAdmin } = data;

    const existingUser = await this.model.findOne({ email });
    if (existingUser) throw new Error("Email already in use");

    const existingUsername = await this.model.findOne({ username });
    if (existingUsername) throw new Error("Username already in use");

    const hashedPassword = await PasswordUtil.hashPassword(password);

    const user = await this.model.create({
      email,
      password: hashedPassword,
      username,
      isAdmin,
    });

    let token;
    if (user) {
      token = tokenUtil.sign_user(
        { userId: user._id, email: user.email, isAdmin: user.isAdmin },
        "7d"
      );
    }

    return { user: user.toJSON(), token };
  }

  async signin(data: { identifier: string; password: string }) {
    const { identifier, password } = data;

    const user = await this.model.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) throw new Error("User does not exist, sign up.");

    const isValid = await PasswordUtil.comparePasswords(
      password,
      user.password
    );
    if (!isValid) throw new Error("Invalid password.");

    const token = tokenUtil.sign_user(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      "7d"
    );

    return { user: user.toJSON(), token };
  }
}

export default new AuthController();
