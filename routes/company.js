import express from "express";
import ValidationService from "../services/validation_service.js";
import UserController from "../controllers/user_controller.js";
import AuthMiddleware from "../middlewares/auth_middleware.js";
import CompanyController from "../controllers/company_controller.js";

const router = express.Router();

router.get("/:id", AuthMiddleware.validateToken, CompanyController.fetchById);
router.post("/", AuthMiddleware.validateToken, CompanyController.create);
router.put("/:id", AuthMiddleware.validateToken, CompanyController.update);

export default router;
