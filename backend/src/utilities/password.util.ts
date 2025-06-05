import bcrypt from "bcrypt";

class PasswordUtil {
  private salt = 12;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async comparePasswords(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}

export default new PasswordUtil();
