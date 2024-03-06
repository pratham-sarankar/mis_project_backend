import TokenService from "../services/token_service.js";

export default class AuthMiddleware {
  static async validateToken(req, res, next) {
    let token = req.headers["authorization"] || req.headers["Authorization"];
    token = token.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }
    try {
      const verified = TokenService.verifyToken(token);
      console.log(verified);
      req.userId = verified.id;
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Invalid Token",
      });
    }
  }
}
