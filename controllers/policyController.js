const InsurancePolicy = require("../models/insurancePolicy");
const Coverage = require("../models/coverage");
const SubscribedWaranties = require("../models/subscribedWaranties");
const Endorsement = require("../models/endorsement");
const Good = require("../models/good");
const PolicyEndorsement = require("../models/policyEndorsement");
const PolicyUsage = require("../models/policyUsage");
const Agency = require("../models/agency");
const InsuranceCompany = require("../models/insuranceCompany");
const generateRandomUID = require("../utils/utilities");

exports.createPolicy = async (req, res) => {
  try {
    const {
      policyNumber,
      policyType,
      subscriptionDate,
      expirationDate,
      cancelationDate,
      policyHolder,
      policyUsage,
      insuranceCompany,
      //good,
      //policyEndorsement,
      agency,
      //subscribedWaranties,
    } = req.body;

    let errors = [];

    if (isNaN(Date.parse(subscriptionDate)))
      errors.push("subscriptionDate is invalid or not provided");
    if (isNaN(Date.parse(expirationDate)))
      errors.push("expirationDate is invalid or not provided");
    if (isNaN(Date.parse(cancelationDate)))
      errors.push("cancelationDate is invalid or not provided");

    if (new Date(expirationDate) < new Date(subscriptionDate))
      errors.push("subscriptionDate cannot be later than expirationDate.");
    if (new Date(cancelationDate) < new Date(subscriptionDate))
      errors.push("subscription cannot be later than cancelationDate.");
    if (new Date(expirationDate) < new Date(cancelationDate))
      errors.push("cancelationDate cannot be later than expirationDate.");

    if (
      !InsurancePolicy.schema.path("policyType").enumValues.includes(policyType)
    )
      errors.push(
        `policyType should be one of this options ${InsurancePolicy.schema.path("policyType").enumValues}`,
      );

    const dbChecks = [];
    const existingPolicy = await InsurancePolicy.findOne({ policyNumber });
    if (existingPolicy) dbChecks.push("PolicyNumber already exists.");

    const checkExistence = async (model, id, modelName) => {
      if (!id) {
        return `Please enter ${modelName}`;
      } else {
        const existingObject = await model.findById(id);
        if (!existingObject) {
          return `${modelName} Object not found.`;
        }
      }
      return null;
    };

    dbChecks.push(
      checkExistence(PolicyUsage, policyUsage, "Policy Usage"),
      checkExistence(InsuranceCompany, insuranceCompany, "Insurance Company"),
      checkExistence(Agency, agency, "Agency"),
      //checkExistence(Good, good, 'Good'),
      // checkExistence(PolicyEndorsement, policyEndorsement, 'Policy Endorsement'),
      //checkExistence(SubscribedWaranties, subscribedWaranties, 'Subscribed Warranties')
    );

    // Execute all checks in parallel
    const checkResults = await Promise.all(dbChecks);
    errors = errors.concat(checkResults.filter((result) => result !== null));

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await InsurancePolicy.create({
      policyNumber,
      policyType,
      subscriptionDate,
      expirationDate,
      cancelationDate,
      policyHolder,
      policyUsage,
      insuranceCompany,
      //good,
      //policyEndorsement,
      agency,
      //subscribedWaranties,
    });
    res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const policyNumber = req.params.policyNumber;
    const { policyNumber: excludedPolicyNumber, ...updateData } = req.body;

    let errors = [];

    if(!updateData.policyHolder) errors.push("policyHolder cannot be empty")

    const { subscriptionDate, expirationDate, cancelationDate } = updateData;
    if (subscriptionDate && isNaN(Date.parse(subscriptionDate)))
      errors.push("subscriptionDate is invalid or not provided");
    if (expirationDate && isNaN(Date.parse(expirationDate)))
      errors.push("expirationDate is invalid or not provided");
    if (cancelationDate && isNaN(Date.parse(cancelationDate)))
      errors.push("cancelationDate is invalid or not provided");

    if (
      subscriptionDate &&
      expirationDate &&
      new Date(expirationDate) < new Date(subscriptionDate)
    )
      errors.push("subscriptionDate cannot be later than expirationDate.");

    if (
      subscriptionDate &&
      cancelationDate &&
      new Date(cancelationDate) < new Date(subscriptionDate)
    )
      errors.push("subscription cannot be later than cancelationDate.");

    if (
      expirationDate &&
      cancelationDate &&
      new Date(expirationDate) < new Date(cancelationDate)
    )
      errors.push("cancelationDate cannot be later than expirationDate.");

    if (
      updateData.policyType &&
      !InsurancePolicy.schema
        .path("policyType")
        .enumValues.includes(updateData.policyType)
    )
      errors.push(
        `policyType should be one of this options ${InsurancePolicy.schema.path("policyType").enumValues}`,
      );

    const checkExistence = async (model, id, modelName) => {
      if (id) {
        const existingObject = await model.findById(id);
        if (!existingObject) {
          return `${modelName} Object not found.`;
        }
      }
      return null;
    };

    const dbChecks = [
      await checkExistence(PolicyUsage, updateData.policyUsage, "Policy Usage"),
      await checkExistence(
        InsuranceCompany,
        updateData.insuranceCompany,
        "Insurance Company",
      ),
      await checkExistence(Agency, updateData.agency, "Agency"),
      await checkExistence(Good, updateData.good, "Good"),
      await checkExistence(
        PolicyEndorsement,
        updateData.policyEndorsement,
        "Policy Endorsement",
      ),
      await checkExistence(
        SubscribedWaranties,
        updateData.subscribedWaranties,
        "Subscribed Warranties",
      ),
    ];

    // Execute all checks in parallel
    const checkResults = await Promise.all(dbChecks);
    errors = errors.concat(checkResults.filter((result) => result !== null));

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedPolicy = await InsurancePolicy.findOneAndUpdate(
      { policyNumber: policyNumber },
      { $set: updateData },
      { new: true },
    );

    if (!updatedPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.status(200).json({ updatedPolicy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPolicy = async (req, res) => {
  try {
    const result = await InsurancePolicy.findOne({
      policyNumber: req.params.policyNumber,
    })
      .populate("policyUsage")
      .populate("insuranceCompany")
      .populate("good")
      .populate({
        path: "policyEndorsement",
        populate: { path: "endorsement" },
      })
      .populate("agency")
      .populate({
        path: "subscribedWaranties",
        populate: { path: "coverage" },
      });

    if (!result) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getListOfPolicies = async (req, res) => {
  const {
    policyHolder,
    policyType,
    policyUsageCode,
    agencyCode,
    endorsementTypeCode,
    listWaranties,
    supscrptionDate,
  } = req.body.filters;

  let result = await InsurancePolicy.find({}).populate({
    path: "subscribedWaranties",
    populate: "coverage",
  });
  try {
    let errors = [];
    if (!result) {
      errors.push("Policy not found");
    }
    if (
      !policyHolder &&
      !policyType &&
      !policyUsageCode &&
      !agencyCode &&
      !endorsementTypeCode &&
      !listWaranties &&
      !supscrptionDate
    )
      errors.push("At least one filter is required.");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    if (policyHolder !== "") {
      result = result.filter(function (obj) {
        return obj.policyHolder === policyHolder;
      });
    }
    if (policyType !== "") {
      result = result.filter(function (obj) {
        return obj.policyType === policyType;
      });
    }
    if (policyUsageCode && policyUsageCode !== "") {
      const policyUsage = await PolicyUsage.findOne({
        usageCode: policyUsageCode,
      });
      if (!policyUsage) {
        return res.status(404).json({ error: "Code Policy Usage not found" });
      }
      result = result.filter(function (obj) {
        return obj.policyUsage === policyUsage._id;
      });
    }
    if (agencyCode && agencyCode !== "") {
      const agency = await Agency.findfindOne({ code: agencyCode });
      if (!agency) {
        return res.status(404).json({ error: "Code Agency not found" });
      }
      result = result.filter(function (obj) {
        return obj.agency === agency._id;
      });
    }
    if (endorsementTypeCode && endorsementTypeCode !== "") {
      const endorsement = await Endorsement.findOne({
        code: endorsementTypeCode,
      });
      if (!endorsement) {
        return res.status(404).json({ error: "Endorsement Type not found" });
      }
      result = result.filter((policy) =>
        policy.policyEndorsement.endorsement.equals(endorsement._id),
      );
    }
    if (supscrptionDate) {
      if (!Array.isArray(supscrptionDate) && supscrptionDate.length !== 2) {
        return res
          .status(400)
          .json({ error: "Supscrption Date should be an array." });
      } else {
        if (supscrptionDate[0] !== "" && supscrptionDate[1] !== "") {
          const dateMin = new Date(supscrptionDate[0]);
          const dateMax = new Date(supscrptionDate[1]);

          if (dateMin <= dateMax)
            result = result.filter(
              (doc) =>
                doc.subscriptionDate >= dateMin &&
                doc.subscriptionDate <= dateMax,
            );
          else {
            return res
              .status(400)
              .json({ error: "issue dateMin or dateMax ." });
          }
        } else if (supscrptionDate[0] !== "") {
          const dateMin = new Date(supscrptionDate[0]);

          result = result.filter((doc) => doc.subscriptionDate >= dateMin);
        } else if (supscrptionDate[1] !== "") {
          const dateMax = new Date(supscrptionDate[1]);
          result = result.filter((doc) => doc.subscriptionDate <= dateMax);
        }
      }
    }
    if (listWaranties) {
      if (!Array.isArray(listWaranties)) {
        return res
          .status(400)
          .json({ error: "list Waarnties should be an array." });
      } else if (listWaranties.length > 0 && listWaranties[0] !== "") {
        result = result.filter((element) =>
          element.subscribedWaranties.some((subscribedWarranty) =>
            listWaranties.includes(subscribedWarranty.coverage.label),
          ),
        );
      }
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}; //to check (filter)

exports.getCoveragesForPolicy = async (req, res) => {
  try {
    const result = await InsurancePolicy.findOne({
      policyNumber: req.params.policyNumber,
    }).populate({
      path: "subscribedWaranties",
      populate: {
        path: "coverage",
      },
    });

    if (!result) {
      return res.status(404).json({ error: "Policy not found" });
    }

    if (
      !result.subscribedWaranties ||
      result.subscribedWaranties.length === 0
    ) {
      return res
        .status(404)
        .json({ error: "No coverages found for this policy" });
    }

    const coverages = result.subscribedWaranties.map(
      (warranty) => warranty.coverage,
    );

    res.status(200).json({ coverages });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getEndorsementsForPolicy = async (req, res) => {
  const policyNumber = req.params.policyNumber;

  try {
    const policy = await InsurancePolicy.findOne({
      policyNumber: policyNumber,
    }).populate({
      path: "policyEndorsement",
      populate: { path: "endorsement" },
    });
    if (policy) {
      const policyEndorsement = policy.policyEndorsement;
      const endorsements = policyEndorsement.map((item) => item.endorsement);

      res.json(endorsements);
    } else {
      res.status(404).json({ success: false, error: "Policy not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGoodsForPolicy = async (req, res) => {
  const policyNumber = req.params.policyNumber;
  try {
    const result = await InsurancePolicy.findOne({
      policyNumber: policyNumber,
    }).populate("good");
    if (!result) {
      return res.status(404).json({ message: "Good not found" });
    }
    const goods = result.good;
    res.status(200).json({ goods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEndorsementToPolicy = async (req, res) => {
  const policyNumber = req.params.policyNumber;
  const endorsementLabel = req.body.label;
  let errors = [];

  try {
    const endorsementCode = generateRandomUID("E"); // Generate endorsement code
    let endorsement = await Endorsement.findOne({
      code: endorsementCode,
      label: endorsementLabel,
    });

    if (!endorsement)
      endorsement = await Endorsement.create({
        code: endorsementCode,
        label: endorsementLabel,
      });

    const policy = await InsurancePolicy.findOne({
      policyNumber: policyNumber,
    });
    if (!policy) errors.push("Policy not found");

    if (errors.length > 0) return res.status(400).json({ errors });

    const newPolicyEndorsement = new PolicyEndorsement({
      endorsementDate: new Date(),
      endorsement: endorsement,
    });
    policy.policyEndorsement.push(newPolicyEndorsement);

    await Promise.all([newPolicyEndorsement.save(), policy.save()]);

    res.status(200).json(newPolicyEndorsement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error.message });
  }
};

exports.addCoverageToPolicy = async (req, res) => {
  const policyNumber = req.params.policyNumber;
  const coverageCode = req.body.code;
  let errors = [];

  try {
    const coverage = await Coverage.findOne({ code: coverageCode });
    if (!coverage) {
      errors.push("Coverage not found");
    }

    const policy = await InsurancePolicy.findOne({ policyNumber });
    if (!policy) {
      errors.push("Policy not found");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const newSubscribedWaranties = new SubscribedWaranties({
      subscriptionDate: new Date(),
      coverage: coverage._id,
      insurancePolicy: policy._id,
    });
    policy.subscribedWaranties.push(newSubscribedWaranties);

    await Promise.all([newSubscribedWaranties.save(), policy.save()]);

    res.status(200).json({ newSubscribedWaranties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error.message });
  }
};

exports.addGoodToPolicy = async (req, res) => {
  const policyNumber = req.params.policyNumber;
  const goodType = req.body.type;
  let errors = [];

  try {
    let dbChecks = [];

    // Check if the provided good type is valid
    if (!Good.schema.path("type").enumValues.includes(goodType))
      errors.push(
        `type should be one of the following options: ${Good.schema.path("type").enumValues}`,
      );

    const policy = await InsurancePolicy.findOne({
      policyNumber: policyNumber,
    });
    if (!policy) dbChecks.push("Policy not found");

    const goodUid = generateRandomUID("G");

    const newGood = new Good({
      uid: goodUid,
      type: goodType,
      insurancePolicy: policy._id,
    });
    policy.good.push(newGood);

    // Execute all checks in parallel
    const checkResults = await Promise.all(dbChecks);
    errors = errors.concat(checkResults.filter((result) => result !== null));

    if (errors.length > 0) return res.status(400).json({ errors });

    await Promise.all([newGood.save(), policy.save()]);

    res.status(200).json({ newGood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

exports.removeGoodFromPolicy = async (req, res) => {
  const { policyNumber, uid } = req.body;
  try {
    const policy = await InsurancePolicy.findOne({ policyNumber });
    if (!policy) {
      return res.status(404).json({ message: "Insurance policy not found" });
    }

    const good = await Good.findOne({ uid, insurancePolicy: policy._id });
    if (!good) {
      return res.status(404).json({ message: "Good not found" });
    }

    // Remove the good from the policy
    policy.good.pull(good._id);
    await policy.save();

    res.status(200).json({ message: "Good deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeCoverageFromPolicy = async (req, res) => {
  try {
    const { policyNumber, code } = req.body;

    const insurancePolicy = await InsurancePolicy.findOne({ policyNumber });
    if (!insurancePolicy)
      return res.status(404).json({ error: "Insurance policy not found." });

    const coverage = await Coverage.findOne({ code: code });
    if (!coverage)
      return res.status(404).json({ error: "Coverage not found." });

    const subscribedWarranties = await SubscribedWaranties.find({
      coverage: coverage._id,
    });
    if (!subscribedWarranties.length)
      return res
        .status(404)
        .json({ error: "No subscribed warranties found for this coverage." });

    // Remove each subscribed warranty from the policy
    for (const subscribedWarranty of subscribedWarranties) {
      insurancePolicy.subscribedWaranties.pull(subscribedWarranty._id);
      await subscribedWarranty.deleteOne();
    }

    await insurancePolicy.save();

    return res.status(200).json({
      message: "Subscribed warranties for the coverage removed successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
