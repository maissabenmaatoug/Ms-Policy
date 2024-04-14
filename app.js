const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");

const policyRouter = require("./routes/policyRoute");
const coverageRouter = require("./routes/coverageRoute");
const goodRouter = require("./routes/goodRoute");

require("dotenv").config();
const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Policy Microservice API Documentation",
      version: "1.0.0",
      description: "ms-policy all apis",
    },
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const port = process.env.PORT || 4000;
const dbConnectionString = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_IP}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port, () => console.log(`ms-policy is running on port ${port}`));

app.use("/api/v0.1", policyRouter);
app.use("/api/v0.1", coverageRouter);
app.use("/api/v0.1", goodRouter);

mongoose.connect(dbConnectionString).then((result) => {
  console.log(`connected to ${result.connections[0].name}`);
});
