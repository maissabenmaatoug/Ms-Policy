const mongoose = require("mongoose");

const GoodCaracteristiqueSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    good: { type: mongoose.Schema.Types.ObjectId, ref: "good" },
    caracteristique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "caracteristique",
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
  "goodCaracteristique",
  GoodCaracteristiqueSchema,
);
