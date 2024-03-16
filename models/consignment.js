import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    srNo: {
      type: Number,
      autoIncrement: true,
      default: 1,
    },
    lrNo: {
      type: String,
      required: true,
    },
    dispatchDate: {
      type: Date,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    vehicleNo: {
      type: String,
      required: true,
    },
    driverMobileNo: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    detention: {
      type: String,
    },
    remarks: {
      type: String,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    ledger: {
      type: Schema.Types.ObjectId,
      ref: "Ledger",
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

export default mongoose.model("Consignment", schema);
