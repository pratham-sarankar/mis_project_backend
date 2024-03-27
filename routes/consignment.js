import express from "express";
import AuthMiddleware from "../middlewares/auth_middleware.js";
import ConsignmentController from "../controllers/consignments_controller.js";
import LedgerController from "../controllers/ledger_controller.js";
import ProfitAndLossController from "../controllers/profit_and_loss_controller.js";

const router = express.Router();

router.get(
  "/client/:id",
  AuthMiddleware.validateToken,
  ConsignmentController.fetchByClient,
);

router.post(
  "/:id",
  AuthMiddleware.validateToken,
  ConsignmentController.create,
  LedgerController.create,
  ProfitAndLossController.create,
);

router.put(
  "/:id/expenses",
  AuthMiddleware.validateToken,
  ConsignmentController.updateExpenses,
);

router.put(
  "/:id/delivery-status",
  AuthMiddleware.validateToken,
  ConsignmentController.updateDeliveryStatus,
);

export default router;
