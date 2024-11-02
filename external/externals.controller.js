// externals.controller.js

const express = require("express");
const router = express.Router();
const externalService = require("./external.service");

// routes
router.get("/fetch-classes", FetchClasses);
router.get("/fetch-employees", FetchEmployees);

router.get('/get-grades-of-students-by-classid/:classid', getAllGrades);


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


function getAllGrades(req, res, next) {

  // Fetch all grades (Prelim, Midterm, Final) for the specified class
  externalService.getAllGrades(req.params.classid)
      .then(result => res.json({
          // message: result.message,
          students: result.students
      }))
      .catch(next);
}