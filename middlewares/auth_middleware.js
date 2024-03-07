import TokenService from "../services/token_service.js";

export default class AuthMiddleware {
  static async validateToken(req, res, next) {
    let token = req.headers["authorization"] || req.headers["Authorization"];
    if (!token) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }
    token = token.split(" ")[1];
    try {
      const verified = TokenService.verifyToken(token);
      console.log(verified);
      req.headers.userId = verified.id;
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Invalid Token",
      });
    }
  }
}
