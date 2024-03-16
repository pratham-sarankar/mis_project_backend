import express from "express";
import ValidationService from "../services/validation_service.js";
import UserController from "../controllers/user_controller.js";
import AuthMiddleware from "../middlewares/auth_middleware.js";

const router = express.Router();

/* GET users listing. */
router.get("/me", AuthMiddleware.validateToken, UserController.fetchMe);
router.get("/:id", AuthMiddleware.validateToken, UserController.fetchById);
router.post("/login", UserController.login);
router.post("/verify-otp", UserController.verifyOTP);
router.post("/resend-otp", UserController.resendOTP);

export default router;
