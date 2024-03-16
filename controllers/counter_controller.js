import Counter from "../models/counter.js";

export default class CounterController {
  static async addAndNotifyConsignmentSrNo() {
    let counter = await Counter.findOne({
      model: "Consignment",
      key: "srNo",
    });
    console.log("First : ", counter);
    //If counter doesn't exist, create a new one.
    if (!counter) {
      const counter = new Counter({
        model: "Consignment",
        key: "srNo",
        seq: 0,
      });
      await counter.save();
      console.log("Second : ", counter);
    }
    counter = await Counter.findOneAndUpdate(
      { model: "Consignment", key: "srNo" },
      { $inc: { seq: 1 } },
      { new: true },
    );
    console.log("Third : ", counter);
    return counter.seq;
  }
}
