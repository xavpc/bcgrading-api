// externals.controller.js

const express = require("express");
const router = express.Router();
const externalService = require("./external.service");

// routes
router.get("/fetch-classes", FetchClasses);
router.get("/fetch-employees", FetchEmployees);

module.exports = router;

function FetchClasses(req, res, next) {
  externalService
    .FetchClasses()
    .then((result) => res.json(result))
    .catch(next);
}

function FetchEmployees(req, res, next) {
  externalService
    .FetchEmployees()
    .then((result) => res.json(result))
    .catch(next);
}
