const db = require('_helpers/db');

module.exports = {

  getAll,
  getAllYear,
  getAllSemester,
  getAllSubject,


  addNewClass,
  addSubject







};


async function getAll() {
    const [results] = await db.sequelize.query(`
        SELECT 
            cl.classid,cl.subjectcode,cl.semester,cl.year,cl.teacherid,cl.created,cl.updated,cl.dateDeleted,cl.dateReactivated,cl.isActive,cl.isDeleted,sl.title FROM Classlists cl LEFT JOIN Subjectlists sl ON cl.subjectcode = sl.subjectcode;
    `);

    // Optionally, log the results to see the output
    // console.log(results);

    // Return the results
    return results;
}


async function getAllYear() {
    return await db.Yearlist.findAll();   
}

async function getAllSemester() {
    return await db.Semesterlist.findAll();  
}

async function getAllSubject() {
    return await db.Subjectlist.findAll();   
}






async function addNewClass(params) {
    // Destructure the parameters
    const { year, semester, subjectcode } = params;

    // Validate the year
    const yearRecord = await db.Yearlist.findOne({
        where: { year: year }
    });
    if (!yearRecord) {
        throw new Error(`Year ${year} not found`);
    }

    // Validate the semester
    const semesterRecord = await db.Semesterlist.findOne({
        where: { semester: semester }
    });
    if (!semesterRecord) {
        throw new Error(`Semester ${semester} not found`);
    }

    // Validate the subject code
    const subjectRecord = await db.Subjectlist.findOne({
        where: { subjectcode: subjectcode }
    });
    if (!subjectRecord) {
        throw new Error(`Subject code ${subjectcode} not found`);
    }

    // If all validations pass, create the new class entry
    const addclass = await db.Classlist.create(params);

   return {
    message: "New class added successfully",
    details: addclass
};
}


async function addSubject(params) {
    const addsubject = await db.Subjectlist.create(params);
    return {
        message: "New SUBJECT added successfully",
        details: addsubject
    };
}