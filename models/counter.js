import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    model: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
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

export default mongoose.model("Counter", schema);
