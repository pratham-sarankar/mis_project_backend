import Consignment from "../models/consignment.js";
import Ledger from "../models/ledger.js";

export default class LedgerController {
  static async create(req, res, next) {
    try {
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
      req.consignment = await (await consignment.save()).populate("ledger");
      next();
    } catch (err) {
      next(err);
    }
  }
}
