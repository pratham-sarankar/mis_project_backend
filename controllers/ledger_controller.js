import Consignment from "../models/consignment.js";
import Ledger from "../models/ledger.js";

export default class LedgerController {
  static async create(req, res, next) {
    let consignment = req.consignment;
    const { totalFreight, advance } = req.body;
    const balance = totalFreight - advance;
    const ledger = new Ledger({
      consignment,
      totalFreight,
      advance,
      balance,
    });
    await ledger.save();
    consignment.ledger = ledger._id;
    consignment = await (await consignment.save()).populate("ledger");
    return res.status(201).json({
      message: "Consignment and Corresponding Ledger created successfully",
      consignment,
    });
  }
}
