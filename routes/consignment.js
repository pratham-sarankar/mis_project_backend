import express from "express";
import AuthMiddleware from "../middlewares/auth_middleware.js";
import ConsignmentController from "../controllers/consignments_controller.js";
import LedgerController from "../controllers/ledger_controller.js";

const router = express.Router();

router.post(
  "/:id",
  AuthMiddleware.validateToken,
  ConsignmentController.create,
  LedgerController.create,
);

export default router;
