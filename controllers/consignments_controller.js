import Consignment from "../models/consignment.js";
import User from "../models/user.js";
import Client from "../models/client.js";
import Company from "../models/company.js";
import CounterController from "./counter_controller.js";

export default class ConsignmentController {
  static async create(req, res, next) {
    try {
      //Required parameters in params: clientId
      const client = req.params.id;
      //Required Parameters in body are :-
      //For Consignment - lrNo, dispatchDate, destination, vehicleNo, driverMobileNo, deliveryStatus, deliveryDate
      //For Ledget - totalFreight, advance
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
        !advance
      ) {
        return res.status(400).json({
          message:
            "lrNo, dispatchDate, destination, vehicleNo, driverMobileNo, deliveryStatus, deliveryDate, totalFreight and advance are required parameters",
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
}
