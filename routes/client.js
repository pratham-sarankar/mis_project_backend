import express from "express";
import ValidationService from "../services/validation_service.js";
import UserController from "../controllers/user_controller.js";
import AuthMiddleware from "../middlewares/auth_middleware.js";
import ClientController from "../controllers/client_controller.js";

const router = express.Router();

/* GET users listing. */
router.post("/", AuthMiddleware.validateToken, ClientController.create);
router.put("/:id", AuthMiddleware.validateToken, ClientController.update);
router.delete("/:id", AuthMiddleware.validateToken, ClientController.delete);

export default router;
