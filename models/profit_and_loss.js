import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    expenses: {
      type: Number,
      default: 0,
    },
    freightOffered: {
      type: Number,
      required: true,
      default: 0,
    },
    profit: {
      type: Number,
      required: true,
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

export default mongoose.model("ProfitAndLoss", schema);
