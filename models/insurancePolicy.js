const mongoose = require("mongoose");

const InsurancePolicySchema = new mongoose.Schema(
  {
    policyNumber: { type: String, unique: true, required: true },
    policyType: {
      type: String,
      enum: ["INDIVIDUALPOLICY", "FLEETPOLICY"],
      required: true,
    },
    subscriptionDate: { type: Date },
    expirationDate: { type: Date, default: null },
    cancelationDate: { type: Date, default: null },
    policyHolder: { type: String, required: true},
    policyUsage: { type: mongoose.Schema.Types.ObjectId, ref: "policyUsage" },
    insuranceCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "insuranceCompany",
    },
    good: [{ type: mongoose.Schema.Types.ObjectId, ref: "good" }],
    policyEndorsement: [
      { type: mongoose.Schema.Types.ObjectId, ref: "policyEndorsement" },
    ],
    agency: { type: mongoose.Schema.Types.ObjectId, ref: "agency" },
    subscribedWaranties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "subscribedWaranties" },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);
module.exports = mongoose.model("insurancePolicy", InsurancePolicySchema);
