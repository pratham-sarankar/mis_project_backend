import mongoose from "../config/database.js";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
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

export default mongoose.model("User", schema);
