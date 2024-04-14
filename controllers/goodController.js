const Good = require("../models/good");
const GoodCaracteristique = require("../models/goodCaracteristique");

exports.addCharacteristicToGood = async (req, res) => {
  const uid = req.params.uid;
  const { key, value } = req.body;

  try {
    const good = await Good.findOne({ uid: uid });
    if (!good) {
      return res.status(404).json({ error: "Good not found" });
    }

    // Normalize the key to lowercase for case-insensitive comparison
    const normalizedKey = key.toLowerCase();

    const existingCharacteristic = await GoodCaracteristique.findOne({
      key: { $regex: new RegExp(`^${normalizedKey}$`, 'i') },
      good: good._id,
    });
    if (existingCharacteristic) {
      return res.status(400).json({ error: "Characteristic with the same key already exists for this good" });
    }

    const formattedKey = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);

    const newGoodCaracteristique = new GoodCaracteristique({
      key: formattedKey,
      value: value,
      good: good._id,
    });
    good.goodCaracteristique.push(newGoodCaracteristique);
    await Promise.all([newGoodCaracteristique.save(), good.save()]);

    res.status(201).json({ message: "Characteristic added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterGoodsByCaracteristique = async (req, res) => {
  const characteristics = req.body;
  let errors = [];
  try {
    // Check if req.body is an array
    if (!Array.isArray(characteristics)) {
      return res
        .status(400)
        .json({ error: "The request body should be an array." });
    }
    for (const { key, value } of characteristics) {
      if (!key && !value) {
        errors.push(
          "Each characteristic should have at least one of key or value.",
        );
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const promises = characteristics.map(async ({ key, value }) => {
      return await GoodCaracteristique.find({ key: key, value: value });
    });

    const matchingCaracteristiquesArray = await Promise.all(promises);

    const matchingCaracteristiques = matchingCaracteristiquesArray.flat();

    if (matchingCaracteristiques.length === 0) {
      return res
        .status(404)
        .json({ error: "No goods found matching the specified criteria." });
    }

    const goodIds = matchingCaracteristiques.map(
      (caracteristique) => caracteristique.good,
    );

    const goods = await Good.find({ _id: { $in: goodIds } });

    res.json(goods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateGood = async (req, res) => {
  try {
    let errors = [];
    const idGood = req.params.uid;
    const { type } = req.body;

    if (!Good.schema.path("type").enumValues.includes(type))
      errors.push(
        `type should be one of this options ${Good.schema.path("type").enumValues}`,
      );

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const updatedGood = await Good.findOneAndUpdate(
      { uid: idGood },
      { $set: { type } },
      { new: true },
    );
    if (!updatedGood) {
      return res.status(404).json({ error: "Good not found" });
    }

    res.status(200).json(updatedGood);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
