const express = require("express");

const {
  createPolicy,
  getPolicy,
  updatePolicy,
  getListOfPolicies,
  getCoveragesForPolicy,
  addCoverageToPolicy,
  addGoodToPolicy,
  addEndorsementToPolicy,
  getEndorsementsForPolicy,
  removeCoverageFromPolicy,
  removeGoodFromPolicy,
  getGoodsForPolicy,
} = require("../controllers/policyController");
const router = express.Router();

//Create Policy
/**
 * @swagger
 * /api/v0.1/policy:
 *   post:
 *     tags:
 *       - Policy
 *     summary: Create a new Policy
 *     description: Creates a new policy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - policyNumber
 *               - policyType
 *               - subscriptionDate
 *               - policyHolder
 *             properties:
 *               policyNumber:
 *                 type: string
 *                 unique: true
 *               policyType:
 *                 type: string
 *                 enum:
 *                     - INDIVIDUALPOLICY
 *                     - FLEETPOLICY
 *               subscriptionDate:
 *                  type: string
 *                  format: date
 *               expirationDate:
 *                  type: string
 *                  format: date
 *                  default: null
 *               cancelationDate:
 *                  type: string
 *                  format: date
 *                  default: null
 *               policyHolder:
 *                  type: string
 *               policyUsage:
 *                  type: string
 *                  description: policyUsage For policy.
 *               insuranceCompany:
 *                  type: string
 *                  description: insuranceCompany For policy.
 *               good:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: good For policy.
 *               policyEndorsement:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: policyEndorsement For policy
 *               agency:
 *                  type: string
 *                  description: agency For policy
 *               subscribedWaranties:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: subscribedWarantie For policy
 *     responses:
 *       201:
 *         description: Policy created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/policy", createPolicy);
//Get Policy
/**
 * @swagger
 * /api/v0.1/policy/{policyNumber}:
 *   get:
 *     tags:
 *       - Policy
 *     summary: Retrieves a specific policy by its policy number
 *     description: Retrieves a specific policy by its policy number.
 *     parameters:
 *       - in: path
 *         name: policyNumber
 *         required: true
 *         description: policyNumber of the policy to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: policy details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: policy not found
 *       500:
 *         description: Server error
 */
router.get("/policy/:policyNumber", getPolicy);
//Update Policy

/**
 * @swagger
 * /api/v0.1/policy/{policyNumber}:
 *   put:
 *     tags:
 *       - Policy
 *     summary: Update a Policy
 *     description: Update Policy in the database.
 *     parameters:
 *       - in: path
 *         name: policyNumber
 *         required: true
 *         description: Unique policyNumber of the Policy to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - policyNumber
 *               - policyType
 *               - subscriptionDate
 *               - policyHolder
 *             properties:
 *               policyNumber:
 *                 type: string
 *                 unique: true
 *               policyType:
 *                 type: string
 *                 enum:
 *                     - INDIVIDUALPOLICY
 *                     - FLEETPOLICY
 *               subscriptionDate:
 *                  type: string
 *                  format: date
 *               expirationDate:
 *                  type: string
 *                  format: date
 *                  default: null
 *               cancelationDate:
 *                  type: string
 *                  format: date
 *                  default: null
 *               policyHolder:
 *                  type: string
 *               policyUsage:
 *                  type: string
 *                  description: policyUsage For policy.
 *               insuranceCompany:
 *                  type: string
 *                  description: insuranceCompany For policy.
 *               good:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: good For policy.
 *               policyEndorsement:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: policyEndorsement For policy
 *               agency:
 *                  type: string
 *                  description: agency For policy
 *               subscribedWaranties:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: subscribedWarantie For policy
 *     responses:
 *       200:
 *         description: Policy updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Server error
 */
router.put("/policy/:policyNumber", updatePolicy);

// Get List Of Policie
/**
 * @swagger
 * /api/v0.1/policy/getListOfPolicie:
 *   post:
 *     tags:
 *          - Policy
 *     summary: Retrieves a list of policies based on filters
 *     description: Retrieves a list of policies based on filters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               PolicyFilters:
 *               type: object
 *               properties:
 *                      policyHolder:
 *                          type: string
 *                          default: ""
 *                      policyType:
 *                          type: string
 *                          default: ""
 *                      policyUsageCode:
 *                          type: string
 *                          default: ""
 *                      agencyCode:
 *                          type: string
 *                          default: ""
 *                      endorsementTypeCode:
 *                          type: string
 *                          default: ""
 *                      listWaranties:
 *                          type: array
 *                          default: [""]
 *                      subscriptionDate:
 *                          type: array
 *                          default: ["",""]
 *   responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Object for filter not found
 *       404:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post("/policy/getListOfPolicie", getListOfPolicies);

// Add Coverage to Policy
/**
 * @swagger
 * /api/v0.1/policy/{policyNumber}/addCoverageToPolicy:
 *   post:
 *     tags:
 *          - Policy
 *     summary: Add Coverage to Policy
 *     description: Add a new coverage to an existing policy.
 *     parameters:
 *       - name: policyNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverage:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   label:
 *                     type: string
 *     responses:
 *       200:
 *         description: Coverage added successfully
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/policy/addCoverageToPolicy/:policyNumber", addCoverageToPolicy);

//Get Coverages for Policy
/**
 * @swagger
 * /api/v0.1/policy/{policyNumber}/getCoveragesForPolicy:
 *   get:
 *     tags:
 *       - Policy
 *     summary: Retrieves a specific policy by policy number
 *     description: Retrieves all coverages associated with a policy
 *     parameters:
 *       - in: path
 *         name: policyNumber
 *         required: true
 *         description: policyNumber of the policy to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of coverage objects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: policy not found
 *       500:
 *         description: Server error
 */
router.get(
  "/policy/getCoveragesForPolicy/:policyNumber",
  getCoveragesForPolicy,
);

//Remove Coverage from Policy
/**
 * @swagger
 * /api/v0.1/policy/removeCoverageFromPolicy:
 *   delete:
 *     tags:
 *          - Policy
 *     summary: Remove a coverage from a policy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyNumber:
 *                 type: string
 *                 description: The policy number of policy
 *               code:
 *                 type: string
 *                 description: The code of the coverage to be removed
 *             required:
 *               - policyNumber
 *               - code
 *     responses:
 *       200:
 *         description: Coverage removed successfully
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/policy/removeCoverageFromPolicy", removeCoverageFromPolicy);

/**
 * @swagger
 * /api/v0.1/policy/addEndorsementToPolicy/{policyNumber}:
 *   post:
 *     tags:
 *          - Policy
 *     summary: Add Endorsement to Policy
 *     description: Add a new Endorsement to an existing policy.
 *     parameters:
 *       - name: policyNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endorsement:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   label:
 *                     type: string
 *     responses:
 *       200:
 *         description: endorsement added successfully
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/policy/addEndorsementToPolicy/:policyNumber",
  addEndorsementToPolicy,
);

//Get Endorsements for Policy
/**
 * @swagger
 * /api/v0.1/policy/{policyNumber}/getEndorsementsForPolicy:
 *   get:
 *     tags:
 *          - Policy
 *     summary: Get Endorsements For Policy
 *     description: Get Endorsements for Policy
 *     parameters:
 *       - name: policyNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of endorsement objects
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/policy/getEndorsementsForPolicy/:policyNumber",
  getEndorsementsForPolicy,
);

// Add Good to Policy
/**
 * @swagger
 * /api/v0.1/policy/{policyNumber}/addGoodToPolicy:
 *   post:
 *     tags:
 *          - Policy
 *     summary: Add Good to Policy
 *     description: Add a new Good to an existing policy.
 *     parameters:
 *       - name: policyNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverage:
 *                 type: object
 *                 properties:
 *                   uid:
 *                     type: string
 *                   Type:
 *                     type: string
 *     responses:
 *       200:
 *         description: Good added successfully
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/policy/addGoodToPolicy/:policyNumber", addGoodToPolicy);

//Get Goods for Policy
/**
 * @swagger
 * /api/v0.1/policy/{policyNumber}/getGoodsForPolicy:
 *   get:
 *     tags:
 *          - Policy
 *     description: Get all goods for a policy number
 *     summary: Get all goods for a policy number
 *     parameters:
 *       - in: path
 *         name: policyNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The policy number
 *     responses:
 *       200:
 *         description: Policy or good not found or Good is not associated with the provided insurance policy
 *       404:
 *         description: Goods not found
 *       500:
 *         description: Server error
 */
router.get("/policy/getGoodsForPolicy/:policyNumber", getGoodsForPolicy);

//Remove Good from Policy
/**
 * @swagger
 * /api/v0.1/policy/removeGoodFromPolicy:
 *   delete:
 *     tags:
 *          - Policy
 *     summary: Remove a good from a policy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyNumber:
 *                 type: string
 *                 description: The policy number of policy
 *               uid:
 *                 type: string
 *                 description: uid of the good to be removed
 *             required:
 *               - policyNumber
 *               - code
 *     responses:
 *       200:
 *         description: Good removed successfully
 *       404:
 *         description: Policy or coverage not found or coverage not subscribed to the policy
 *       500:
 *         description: Internal Server Error
 */
router.delete("/policy/removeGoodFromPolicy", removeGoodFromPolicy);

module.exports = router;
