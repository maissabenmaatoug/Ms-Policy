const mongoose = require("mongoose");

const GoodSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: ["VEHICULE", "EQUIPMENT", "HOME"],
      required: true,
    },
    insurancePolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "insurancePolicy",
    },
    //policyEndorsement : [{ type: mongoose.Schema.Types.ObjectId, ref: 'policyEndorsement' }],
    goodCaracteristique: [
      { type: mongoose.Schema.Types.ObjectId, ref: "goodCaracteristique" },
    ],
    //policyEndorsementGood : [{ type: mongoose.Schema.Types.ObjectId, ref: 'policyEndorsementGood' }]
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model("good", GoodSchema);
