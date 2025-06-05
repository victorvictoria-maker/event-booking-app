import * as jwt from "jsonwebtoken";
import env from "../env";
import { UserApiResp } from "../api-response/user.response";

class TokenUtil {
  sign_user(payload: any, expiresIn: string | number) {
    return jwt.sign(payload, env?.JWT_KEY, {
      expiresIn: expiresIn ? expiresIn : "7d",
    });
  }
  verify_user(token: string): any {
    return new Promise((resolve, reject) => {
      try {
        const resp = jwt.verify(token, env.JWT_KEY);
        resolve(resp);
      } catch (error) {
        reject({ error, ...UserApiResp.NOT_AUTHORIZED });
      }
    });
  }
}
export default new TokenUtil();
