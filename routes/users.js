import express from 'express';
import ValidationService from "../services/validation_service.js";
import UserController from "../controllers/user_controller.js";

const  router = express.Router();

/* GET users listing. */
router.post('/login', UserController.login);

export default router;