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
router.get('/teacherlist',authorize([Role.Admin, Role.Registrar]),  getAllTeacher);

router.post('/addclass', newclassSchema,addnewclass);
router.post('/addsubject', authorize(Role.Registrar), newsubjectSchema,addSubject);
router.post('/addstudentToclass', addStudentToClassSchema,addStudentToClass);

router.get('/:classid',  getClassGradesAndAttendance);

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

function getAllTeacher(req, res, next) {
    Service.getAllTeacher()
        .then(teachers => res.json(teachers))
        .catch(next);
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


function addStudentToClass(req, res, next) {
    Service.addStudentToClass(req.body)
        .then(result => res.json({
            message: result.message,
            class: result.class
        }))
        .catch(next);
}

//schema functions

function addStudentToClassSchema(req, res, next) {
    const schema = Joi.object( {   
        classid: Joi.number().required(),
        studentid: Joi.number().required(),
        
       

    });
    validateRequest(req, next, schema);
}



function getClassGradesAndAttendance(req, res, next) {
   

    Service.getClassGradesAndAttendance(req.params.classid)
        .then(grades => grades ? res.json(grades) : res.sendStatus(404))
        .catch(next);
}