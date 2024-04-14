const Coverage = require("../models/coverage");
const generateRandomUID = require("../utils/utilities");

exports.addCoverage = async (req, res) => {
  try {
    const { label } = req.body;
    const code = generateRandomUID("C");
    const result = await Coverage.create({
      code,
      label,
    });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.updateCoverage = async (req, res) => {
  try {
    const codeCoverage = req.params.code;
    const { label } = req.body;

    const updatedCoverage = await Coverage.findOneAndUpdate(
      { code: codeCoverage },
      { $set: { label } },
      { new: true },
    );

    if (!updatedCoverage) {
      return res.status(404).json({ error: "Coverage not found" });
    }

    res.status(200).json({ updatedCoverage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
