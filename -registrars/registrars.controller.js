const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const Service = require('./registrar.service');



router.get('/', authorize([Role.Admin, Role.Registrar]), getAll);
router.get('/years',  authorize([Role.Admin, Role.Registrar]), getAllYear);
router.get('/semesters' ,authorize([Role.Admin, Role.Registrar]), getAllSemester);
router.get('/subjects', authorize([Role.Admin, Role.Registrar]), getAllSubject);


router.get('/year/:year', authorize([Role.Admin, Role.Registrar]), getClassesByYear);
router.get('/semester/:semester', authorize([Role.Admin, Role.Registrar]),getClassesBySemester);
router.get('/subject/:subjectcode',authorize([Role.Admin, Role.Registrar]), getClassesBySubject);
router.get('/year/:year/semester/:semester',authorize([Role.Admin, Role.Registrar]), getClassesByYearAndSemester);

router.get('/semester/:semester/year/:year',authorize([Role.Admin, Role.Registrar]), getClassesByYearAndSemester);

router.get('/year/:year/subject/:subjectcode',authorize([Role.Admin, Role.Registrar]), getClassesByYearAndSubject);

router.get('/subject/:subjectcode/year/:year',authorize([Role.Admin, Role.Registrar]), getClassesByYearAndSubject);

router.get('/semester/:semester/subject/:subjectcode',authorize([Role.Admin, Role.Registrar]), getClassesBySemesterAndSubject);

router.get('/subject/:subjectcode/semester/:semester',authorize([Role.Admin, Role.Registrar]), getClassesBySemesterAndSubject);

router.get('/year/:year/semester/:semester/subject/:subjectcode',authorize([Role.Admin, Role.Registrar]), getClassesByYearAndSemesterAndSubject);

router.post('/addclass', authorize(Role.Registrar), newclassSchema,addnewclass);
router.post('/addsubject', authorize(Role.Registrar), newsubjectSchema,addSubject);

module.exports = router;

function getAll(req, res, next) {
    Service.getAll()
        .then(classes => res.json(classes))
        .catch(next);
}

function getAllYear(req, res, next) {
    Service.getAllYear()
        .then(years => res.json(years))
        .catch(next);
}

function getAllSemester(req, res, next) {
    Service.getAllSemester()
        .then(sem => res.json(sem))
        .catch(next);
}
function getAllSubject(req, res, next) {
    Service.getAllSubject()
        .then(subjects => res.json(subjects))
        .catch(next);
}



function getClassesByYear(req, res, next) {
    Service.getClassesByYear(req.params.year)
        .then(classsesbyyear => res.json(classsesbyyear))
        .catch(next)
}

function getClassesBySemester(req, res, next) {
    Service.getClassesBySemester(req.params.semester)
        .then(classsesbysemester => res.json(classsesbysemester))
        .catch(next)
}

function getClassesBySubject(req, res, next) {
    Service.getClassesBySubject(req.params.subjectcode)
        .then(classesbysubjectcodes => res.json(classesbysubjectcodes))
        .catch(next)
}

function getClassesByYearAndSemester(req, res, next) {
    Service.getClassesByYearAndSemester(req.params.year, req.params.semester)
        .then(yearandsemester => res.json(yearandsemester))
        .catch(next)
}
function getClassesByYearAndSubject(req, res, next) {
    Service.getClassesByYearAndSubject(req.params.year, req.params.subjectcode)
        .then(yearandsubjectr => res.json(yearandsubjectr))
        .catch(next)
}
function getClassesBySemesterAndSubject(req, res, next) {
    Service.getClassesBySemesterAndSubject(req.params.subjectcode, req.params.semester)
        .then(semesterandsubject => res.json(semesterandsubject)) 
        .catch(next)
}

function getClassesByYearAndSemesterAndSubject(req, res, next) {
    Service.getClassesByYearAndSemesterAndSubject(req.params.year, req.params.semester, req.params.subjectcode)
        .then(yearandsemesterandsubject => res.json(yearandsemesterandsubject))
        .catch(next)
}


function addnewclass(req, res, next) {
    Service.addNewClass(req.body)
        .then(result => res.json({
            message: result.message,
            class: result.class
        }))
        .catch(next);
}

//schema functions

function newclassSchema(req, res, next) {
    const schema = Joi.object( {   
        subjectcode: Joi.string().required(),
        semester: Joi.string().required(),
        year: Joi.string().required(),
       
        teacherid: Joi.number().integer().min(0),
    });
    validateRequest(req, next, schema);
}


function addSubject(req, res, next) {
    Service.addSubject(req.body)
        .then(result => res.json({
            message: result.message,
            class: result.class
        }))
        .catch(next);
}

function newsubjectSchema(req, res, next) {
    const schema = Joi.object( {   
        subjectcode: Joi.string().required(),
        title: Joi.string().required(),
      
    });
    validateRequest(req, next, schema);
}