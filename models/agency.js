const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    address: {
      uid: { type: String, required: true },
      postalCode: { type: String },
      street: { type: String },
      numbrer: { type: Number },
      city: { type: String },
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model("agency", agencySchema);
