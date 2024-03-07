import mongoose, { Schema } from "mongoose";
import Company from "./company.js";

const schema = new Schema(
  {
    name: {
      type: String,
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

export default mongoose.model("Client", schema);
