const mongoose = require("mongoose");

const subscribedWarantiesSchema = new mongoose.Schema(
  {
    subscriptionDate: { type: Date, default: null },
    coverage: { type: mongoose.Schema.Types.ObjectId, ref: "coverage" },
    insurancePolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "insurancePolicy",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model(
  "subscribedWaranties",
  subscribedWarantiesSchema,
);
