const mongoose = require("mongoose");

const InsuranceCompanySchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    label: { type: String, unique: true, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model("insuranceCompany", InsuranceCompanySchema);
