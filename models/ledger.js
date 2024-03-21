import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    totalFreight: {
      type: Number,
      required: true,
    },
    advance: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    profitAndLoss: {
      type: Schema.Types.ObjectId,
      ref: "ProfitAndLoss",
    },
  },
  {
    versionKey: false,
  },
);

schema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("Ledger", schema);
