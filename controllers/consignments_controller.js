import Consignment from "../models/consignment.js";
import User from "../models/user.js";
import Client from "../models/client.js";
import Company from "../models/company.js";
import CounterController from "./counter_controller.js";

export default class ConsignmentController {
  static async fetchByClient(req, res, next) {
    try {
      const id = req.params.id;
      const consignments = await Consignment.find({ client: id })
        .populate({
          path: "ledger",
          populate: { path: "profitAndLoss" },
        })
        .exec();
      return res.status(200).json({
        message: "Consignments fetched successfully",
        consignments,
      });
    } catch (err) {
      next(err);
    }
  }
  static async create(req, res, next) {
    try {
      //Required parameters in params: clientId
      const client = req.params.id;
      //Required Parameters in body are :-
      //For Consignment - lrNo, dispatchDate, destination, vehicleNo, driverMobileNo, deliveryStatus, deliveryDate
      //For Ledger - totalFreight, advance
      //For ProfitAndLoss - freightOffered.
      const {
        lrNo,
        dispatchDate,
        destination,
        vehicleNo,
        driverMobileNo,
        deliveryStatus,
        deliveryDate,
        totalFreight,
        advance,
        freightOffered,
      } = req.body;
      if (
        !lrNo ||
        !dispatchDate ||
        !destination ||
        !vehicleNo ||
        !driverMobileNo ||
        !deliveryStatus ||
        !deliveryDate ||
        !totalFreight ||
        !advance ||
        !freightOffered
      ) {
        return res.status(400).json({
          message:
            "lrNo, dispatchDate, destination, vehicleNo, driverMobileNo, deliveryStatus, deliveryDate, totalFreight, advance and freightOffered are required parameters",
        });
      }
      //Get userId from parameter and fetch user.
      const userId = req.headers.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      //Find the list of clients from user.company
      const company = await Company.findById(user.company);
      console.log(company.clients);
      console.log(req.params);
      if (!company.clients.includes(client)) {
        //In this case, the client doesn't belong to the requesting user's company. Hence, we return a 403.
        return res
          .status(403)
          .json({ message: "Client doesn't belong to the user's company." });
      }
      //Get the srNo from CounterController
      const srNo = await CounterController.addAndNotifyConsignmentSrNo();
      //Create a new consignment
      const consignment = new Consignment({
        srNo,
        lrNo,
        dispatchDate,
        destination,
        vehicleNo,
        driverMobileNo,
        deliveryStatus,
        deliveryDate,
        client,
      });
      await consignment.save();
      req.consignment = consignment;
      next();
    } catch (err) {
      next(err);
    }
  }
  static async updateExpenses(req, res, next) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is a required parameter",
      });
    }
    const { action, amount } = req.body;
    if (!action || !amount) {
      return res.status(400).json({
        message: "Action and amount are required parameters",
      });
    }
    if (isNaN(amount) || !Number.isInteger(amount)) {
      return res.status(400).json({
        message: "Amount should be a number",
      });
    }
    if (action !== "Add" && action !== "Subtract") {
      return res.status(400).json({
        message: "Action should be either Add or Subtract",
      });
    }
    try {
      const consignment = await Consignment.findById(id)
        .populate({
          path: "ledger",
          populate: { path: "profitAndLoss" },
        })
        .exec();
      if (!consignment) {
        return res.status(404).json({ message: "Consignment not found" });
      }
      let expenses = consignment.ledger.profitAndLoss.expenses;
      if (action === "Add") {
        expenses += amount;
      } else if (action === "Subtract") {
        expenses -= amount;
      }
      if (expenses < 0) {
        return res.status(400).json({
          message: "Expenses cannot be negative",
        });
      }
      consignment.ledger.profitAndLoss.expenses = expenses;
      consignment.ledger.profitAndLoss.profit =
        consignment.ledger.totalFreight -
        consignment.ledger.profitAndLoss.freightOffered -
        expenses;
      await consignment.ledger.profitAndLoss.save();
      return res.status(200).json({
        message: "Expenses updated successfully",
        consignment,
      });
    } catch (e) {
      next(e);
    }
  }

  static async updateDeliveryStatus(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({
          message: "id is a required parameter",
        });
      }
      const { deliveryStatus } = req.body;
      if (!deliveryStatus) {
        return res.status(400).json({
          message: "deliveryStatus is a required parameter",
        });
      }
      const consignment = await Consignment.findById(id)
        .populate({
          path: "ledger",
          populate: { path: "profitAndLoss" },
        })
        .exec();
      if (!consignment) {
        return res.status(404).json({ message: "Consignment not found" });
      }
      consignment.deliveryStatus = deliveryStatus;
      await consignment.save();
      return res.status(200).json({
        message: "Delivery Status updated successfully",
        consignment,
      });
    } catch (e) {
      next(e);
    }
  }
}
