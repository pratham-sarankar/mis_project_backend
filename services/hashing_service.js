import bcrypt from "bcryptjs";

export default class HashingService {
  static async generateHash(value) {
    return await bcrypt.hash(value, 10);
  }

  static async compareHash(value, hash) {
    return await bcrypt.compare(value, hash);
  }
}
