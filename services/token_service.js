import jwt from "jsonwebtoken";

export default class TokenService {
  static generateVerificationToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
  }
  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  }
}
