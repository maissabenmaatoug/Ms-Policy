const express = require("express");

const {
  addCharacteristicToGood,
  filterGoodsByCaracteristique,
  updateGood,
} = require("../controllers/goodController");

const router = express.Router();

//Add a characteristic to a good
/**
 * @swagger
 * /api/v0.1/good/{uid}/addCharacteristic:
 *   post:
 *     tags:
 *          - Good
 *     summary: Add a new characteristic to a good
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The uid of the good
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: The key of the characteristic
 *               value:
 *                 type: string
 *                 description: The value of the characteristic
 *     responses:
 *       201:
 *         description: Characteristic added successfully
 *       404:
 *         description: Good not found
 *       500:
 *         description: Server error
 */
router.post("/good/addCharacteristic/:uid", addCharacteristicToGood);

// Filter Goods by Caracteristique
/**
 * @swagger
 * /api/v0.1/good/filterGoodsByCaracteristique:
 *   post:
 *     tags:
 *       - Good
 *     summary: Retrieves goods matching specified characteristic criteria
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 key:
 *                   type: string
 *                   description: The key filter of the characteristic
 *                 value:
 *                   type: string
 *                   description: The value filter of the characteristic
 *     responses:
 *       200:
 *         description: Successful operation. Returns goods found.
 *       400:
 *         description: The request body should be an array.
 *       404:
 *         description: No goods found matching the specified criteria.
 *       500:
 *         description: Internal server error.
 */
router.post("/good/filterGoodsByCaracteristique", filterGoodsByCaracteristique);
//Update Good

/**
 * @swagger
 * /api/v0.1/good/{uid}:
 *   put:
 *     tags:
 *       - Good
 *     summary: Update a Good
 *     description: Update Good in the database.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: Unique uid of the Good to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: uid of Good.
 *               type:
 *                 type: string
 *                 description: type of Good.
 *     responses:
 *       200:
 *         description: Good updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Good not found
 *       500:
 *         description: Server error
 */
router.put("/good/:uid", updateGood);

module.exports = router;
