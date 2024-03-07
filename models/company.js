import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    transportName: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
      unique: true,
    },
    clients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
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

export default mongoose.model("Company", schema);
