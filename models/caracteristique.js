const mongoose = require("mongoose");

const CaracteristiqueSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    label: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

module.exports = mongoose.model("caracteristique ", CaracteristiqueSchema);
