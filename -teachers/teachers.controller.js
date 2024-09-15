const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const Service = require('./teacher.service');



// router.get('/', authorize(Role.Teacher), getAll);
router.get('/:teacherid', authorize(Role.Teacher), getAll);
router.get('/years/:teacherid', authorize(Role.Teacher),  getAllYear);
router.get('/semesters/:teacherid', authorize(Role.Teacher),  getAllSemester);
router.get('/subjects/:teacherid', authorize(Role.Teacher),  getAllSubject);

router.get('/studentlist/:classid', authorize(Role.Teacher), getStudentsInClass);
router.post('/addgrade',  newGradeSchema,addnewGrade);
router.post('/addattendance',  newAttendanceSchema,addNewAttendance);
router.post('/addexam',  newExamSchema,addNewExam);
router.put('/updateattendance/:scoreid', updateAttendance,AttendanceSchema);

router.get('/Prelim/Attendance/:classid', getPrelimAttendance);

router.get('/Prelim/Participation/:classid', getPrelimParticipation);

router.get('/Prelim/Quiz/:classid', getPrelimQuiz);

router.get('/Prelim/Activity/:classid', getPrelimActivity)  ;

router.get('/Prelim/Exam/:classid', getPrelimExam);

//////

router.get('/Midterm/Attendance/:classid', getMidtermAttendance);

router.get('/Midterm/Participation/:classid', getMidtermParticipation);

router.get('/Midterm/Quiz/:classid', getMidtermQuiz);

router.get('/Midterm/Activity/:classid', getMidtermActivity);

router.get('/Midterm/Exam/:classid', getMidtermExam);

//////

router.get('/Final/Attendance/:classid', getFinalAttendance);

router.get('/Final/Participation/:classid', getFinalParticipation);

router.get('/Final/Quiz/:classid', getFinalQuiz);

router.get('/Final/Activity/:classid', getFinalActivity);

router.get('/Final/Exam/:classid', getFinalExam);

router.get('/getgradelist/:gradeid', getGradeList);

module.exports = router;

function getAll(req, res, next) {
    Service.getAll(req.params.teacherid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getAllYear(req, res, next) {
    Service.getAllYear(req.params.teacherid)
        .then(years => res.json(years))
        .catch(next);
}

function getAllSemester(req, res, next) {
    Service.getAllSemester(req.params.teacherid)
        .then(sem => res.json(sem))
        .catch(next);
}
function getAllSubject(req, res, next) {
    Service.getAllSubject(req.params.teacherid)
        .then(subjects => res.json(subjects))
        .catch(next);
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

function addnewGrade(req, res, next) {
    Service.addNewGrade(req.body)
        .then(result => res.json({
        message: result.message,
        gradeDetails: result.gradeDetails,
        scoreEntries: result.scoreEntries
        }))
        .catch(next);
}

function addNewAttendance(req, res, next) {
    Service.addNewAttendance(req.body)
        .then(result => res.json({
        message: result.message,
        gradeDetails: result.gradeDetails,
        scoreEntries: result.scoreEntries
        }))
        .catch(next);
}

function addNewExam(req, res, next) {
    Service.addNewExam(req.body)
        .then(result => res.json({
        message: result.message,
        gradeDetails: result.gradeDetails,
        scoreEntries: result.scoreEntries
        }))
        .catch(next);
}

//schema functions

function newGradeSchema(req, res, next) {
    const schema = Joi.object({   
        classid: Joi.number().required(),
        term: Joi.string().valid('Prelim', 'Midterm', 'Final').required(),
        scoretype: Joi.string().valid('Participation', 'Quiz', 'Activity-Project', 'Exam').required(),
        // score: Joi.number().required(),
        perfectscore: Joi.number().required(),
    });
    
    validateRequest(req, next, schema);
}

function newAttendanceSchema(req, res, next) {
    const schema = Joi.object({   
        classid: Joi.number().required(),
        term: Joi.string().valid('Prelim', 'Midterm', 'Final').required(),
        scoretype: Joi.string().valid('Attendance').required(),
        attendanceDate: Joi.date().required(),
      
    });
    
    validateRequest(req, next, schema);
}
function newExamSchema(req, res, next) {
    const schema = Joi.object({   
        classid: Joi.number().required(),
        term: Joi.string().valid('Prelim', 'Midterm', 'Final').required(),
        scoretype: Joi.string().valid('Exam').required(),
        perfectscore: Joi.number().required(),
      
    });
    
    validateRequest(req, next, schema);
}

function getPrelimAttendance(req, res, next) {
    Service.getPrelimAttendance(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getPrelimParticipation(req, res, next) {
    Service.getPrelimParticipation(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getPrelimQuiz(req, res, next) {
    Service.getPrelimQuiz(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}
function  getPrelimActivity(req, res, next) {
    Service. getPrelimActivity(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}
function getPrelimExam(req, res, next) {
    Service.getPrelimExam(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

/////

function getMidtermAttendance(req, res, next) {
    Service.getMidtermAttendance(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getMidtermParticipation(req, res, next) {
    Service.getMidtermParticipation(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getMidtermQuiz(req, res, next) {
    Service.getMidtermQuiz(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}
function  getMidtermActivity(req, res, next) {
    Service. getMidtermActivity(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}
function getMidtermExam(req, res, next) {
    Service.getMidtermExam(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

///////

function getFinalAttendance(req, res, next) {
    Service.getFinalAttendance(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getFinalParticipation(req, res, next) {
    Service.getFinalParticipation(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}

function getFinalQuiz(req, res, next) {
    Service.getFinalQuiz(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}
function  getFinalActivity(req, res, next) {
    Service. getFinalActivity(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}
function getFinalExam(req, res, next) {
    Service.getFinalExam(req.params.classid)
        .then(classes => res.json(classes))
        .catch(next);
}




function getGradeList(req, res, next) {
    Service.getGradeList(req.params.gradeid)
        .then(grades => res.json(grades))
        .catch(next);
}

function updateAttendance(req, res, next) {
    Service.updateAttendance(req.params.scoreid, req.body)
        .then((updatedGrade) => res.json({
            message: 'Grade updated successfully',
            data: updatedGrade
        }))
        .catch(next);
}

function AttendanceSchema(req, res, next) {
    const schema = Joi.object({
        attendanceStatus: Joi.string().valid('Present', 'Absent', 'Late', 'Excused').required(),
    });
    validateRequest(req, next, schema);
}
