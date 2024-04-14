const mongoose = require("mongoose");

const PolicyUsageSchema = new mongoose.Schema(
  {
    usageCode: { type: String, unique: true },
    label: { type: String },
  },

  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model("policyUsage", PolicyUsageSchema);
