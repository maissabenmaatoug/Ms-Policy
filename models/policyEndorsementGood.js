const mongoose = require("mongoose");

const PolicyEndorsementGoodSchema = new mongoose.Schema(
  {
    policyEndorsement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "policyEndorsement",
    },
    good: { type: mongoose.Schema.Types.ObjectId, ref: "good" },
  },

  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model(
  "policyEndorsementGood",
  PolicyEndorsementGoodSchema,
);
