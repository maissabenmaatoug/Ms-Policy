const express = require("express");

const {
  addCoverage,
  updateCoverage,
} = require("../controllers/coverageController");
const router = express.Router();
//Add Coverage

router.post("/coverage", addCoverage);
/**
 * @swagger
 * /api/v0.1/coverage/{code}:
 *   put:
 *     tags:
 *       - Coverage
 *     summary: Update a coverage
 *     description: Update an existing coverage in the database.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Unique code of the coverage to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: code of coverage.
 *               label:
 *                 type: string
 *                 description: label of coverage.
 *     responses:
 *       200:
 *         description: coverage updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: coverage not found
 *       500:
 *         description: Server error
 */
//Update Coverage
router.put("/coverage/:code", updateCoverage);

module.exports = router;
