import ProfitAndLoss from "../models/profit_and_loss.js";

export default class ProfitAndLossController {
  static async create(req, res, next) {
    try {
      const { freightOffered } = req.body;
      if (!freightOffered) {
        return res.status(400).json({
          message: "freightOffered is a required parameter",
        });
      }

      const consignment = req.consignment;
      const ledger = consignment.ledger;
      const totalFreight = ledger.totalFreight;
      const profit = totalFreight - freightOffered;

      //Create a profit and loss entry for the consignment
      const profitAndLoss = new ProfitAndLoss({
        freightOffered,
        profit,
      });
      await profitAndLoss.save();

      //Load the consignment with ledger with profit and loss
      ledger.profitAndLoss = profitAndLoss._id;
      req.consignment.ledger = await (
        await ledger.save()
      ).populate("profitAndLoss");
      return res.status(201).json({
        message: "Profit and Loss created successfully",
        consignment: req.consignment,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateExpenses(req, res, next) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({});
    }
  }
}
