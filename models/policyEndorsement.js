const mongoose = require("mongoose");

const PolicyEndorsementSchema = new mongoose.Schema(
  {
    endorsementDate: { type: Date },
    insurancePolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "insurancePolicy",
    },
    endorsement: { type: mongoose.Schema.Types.ObjectId, ref: "endorsement" },
    policyEndorsementGood: [
      { type: mongoose.Schema.Types.ObjectId, ref: "policyEndorsementGood" },
    ],
  },

  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model("policyEndorsement", PolicyEndorsementSchema);
