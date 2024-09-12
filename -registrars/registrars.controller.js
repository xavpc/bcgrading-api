const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const Service = require('./registrar.service');



router.get('/', authorize([Role.Admin, Role.Registrar]), getAll);
router.get('/years',  authorize([Role.Admin, Role.Registrar, Role.Teacher]), getAllYear);
router.get('/semesters' ,authorize([Role.Admin, Role.Registrar, Role.Teacher]), getAllSemester);
router.get('/subjects', authorize([Role.Admin, Role.Registrar , Role.Teacher]), getAllSubject);
router.get('/teacherlist',authorize([Role.Admin, Role.Registrar]),  getAllTeacher);
router.post('/addsubject', authorize(Role.Registrar), newsubjectSchema,addSubject);


router.post('/addclass', newclassSchema,addnewclass);
router.get('/studentlist/:classid', getStudentsInClass);
router.get('/studentnotinclass/:classid', getAllStudentsNotInClass);
router.get('/classinfo/:classid',authorize([Role.Admin, Role.Registrar , Role.Teacher]), getByID);

router.post('/addstudentToclass', addStudentToClassSchema,addStudentToClass);








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


function getByID(req, res, next) {
    Service.getByID(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getAllStudentsNotInClass(req, res, next) {
    Service.getAllStudentsNotInClass(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}


function addnewclass(req, res, next) {
    Service.addNewClass(req.body)
        .then(result => res.json({
            message: result.message,
            classDetails: result.classDetails  
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
            StudentAddedToClassDetails: result.StudentAddedToClassDetails  
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

function getStudentsInClass(req, res, next) {
    // Directly use req.params.classid without destructuring
    Service.getStudentsInClass(req.params.classid)
        .then(result => res.json({
            message: result.message,
            students: result.students
        }))
        .catch(next);
}

