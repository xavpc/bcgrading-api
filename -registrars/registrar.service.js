const db = require('_helpers/db');

module.exports = {

  getAll,
  getAllYear,
  getAllSemester,
  getAllSubject,

  getClassesByYear,
  getClassesBySemester,
  getClassesBySubject,
  getClassesByYearAndSemester,
  getClassesByYearAndSubject,
  getClassesBySemesterAndSubject,
  getClassesByYearAndSemesterAndSubject,

  addNewClass,
  addSubject







};


async function getAll() {
    return await db.Classlist.findAll();   
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


async function getClassesByYear(year) {
    const yearRecord = await db.Yearlist.findOne({ where: { year } }); //findone in yearlisttable
    if (!yearRecord) throw new Error(`Year ${year} not found`);

    const classList = await db.Classlist.findAll({
        where: { year: yearRecord.year},
        include: [
            { model: db.Yearlist, as: 'ClassListByYear', attributes: ['year'] }, // Use the correct alias and attribute           
        ],
        attributes: ['subjectcode', 'classid', 'semester']
    });

    return { //  response object Structure
        year: yearRecord.year,
        ClassListbyYear: classList.map(({ classid, subjectcode, semester }) => ({
            // year: yearRecord.year,
            classid,
            subjectcode,
            semester
        }))
    };
}


async function getClassesBySemester(semester) {
    const semesterRecord = await db.Semesterlist.findOne({ where: { semester } }); //findone in semlistable
    if (!semesterRecord) throw new Error(`Semester ${semester} not found`);

    const classList = await db.Classlist.findAll({
        where: { semester: semesterRecord.semester},
        include: [
            { model: db.Semesterlist, as: 'ClassListBySemester', attributes: ['semester'] } // Use the correct alias and attribute
        ],
        attributes: ['subjectcode', 'classid', 'year']
    });

    return { //  response object Structure
        semester: semesterRecord.semester,
        ClassListbyYear: classList.map(({ classid, subjectcode, year }) => ({
            // semester: semesterRecord.semester,
            classid,
            subjectcode,
            year
        }))
    };
}


async function getClassesBySubject(subjectcode) {
    const subjectRecord = await db.Subjectlist.findOne({ where: { subjectcode } }); //findone in semlistable
    if (!subjectRecord) throw new Error(`Subject ${subjectcode} not found`);

    const classList = await db.Classlist.findAll({
        where: { subjectcode: subjectRecord.subjectcode},
        include: [
            { model: db.Subjectlist, as: 'ClassListBySubject', attributes: ['subjectcode'] } // Use the correct alias and attribute
        ],
        attributes: ['classid', 'year','semester', ]
    });

    return { //  response object Structure
        subjectcode: subjectRecord.subjectcode,
        ClassListbySubject: classList.map(({ classid, year, semester }) => ({
            subjectcode: subjectRecord.subjectcode,
            classid,
            year,
            semester
        }))
    };
}



async function getClassesByYearAndSemester(year, semester) {
    const yearRecord = await db.Yearlist.findOne({ where: { year } }); //findone in yearlisttable
    if (!yearRecord) throw new Error(`Year ${year} not found`);

    const semesterRecord = await db.Semesterlist.findOne({ where: { semester } }); //findone in semlistable
    if (!semesterRecord) throw new Error(`Semester ${semester} not found`);

    const classList = await db.Classlist.findAll({
        where: { year: yearRecord.year, semester: semesterRecord.semester },
        include: [
            { model: db.Yearlist, as: 'ClassListByYear', attributes: ['year'] }, // Use the correct alias and attribute
            { model: db.Semesterlist, as: 'ClassListBySemester', attributes: ['semester'] } // Use the correct alias and attribute
        ],
        attributes: ['subjectcode', 'classid']
    });

    return { //  response object Structure
        year: yearRecord.year,
        semester: semesterRecord.semester,
        ClassListbyYearAndSemester: classList.map(({ classid, subjectcode }) => ({
            // year: yearRecord.year,
            // semester: semesterRecord.semester,
            classid,
            subjectcode
        }))
    };
}

async function getClassesByYearAndSubject(year, subjectcode) {
    const yearRecord = await db.Yearlist.findOne({ where: { year } }); //findone in yearlisttable
    if (!yearRecord) throw new Error(`Year ${year} not found`);

    const subjectRecord = await db.Subjectlist.findOne({ where: { subjectcode } }); //findone in subjectlisttable
    if (!subjectRecord) throw new Error(`Subject ${subjectcode} not found`);

    const classList = await db.Classlist.findAll({
        where: { year: yearRecord.year, subjectcode: subjectRecord.subjectcode },
        include: [
            { model: db.Yearlist, as: 'ClassListByYear', attributes: ['year'] }, // Use the correct alias and attribute
            { model: db.Subjectlist, as: 'ClassListBySubject', attributes: ['subjectcode'] } // Use the correct alias and attribute
        ],
        attributes: ['semester', 'classid']
    });

    return { //  response object Structure
        year: yearRecord.year,
        subjectcode: subjectRecord.subjectcode,      
        ClassListbyYearAndSemester: classList.map(({ classid, semester }) => ({
            // year: yearRecord.year,
            semester,
            classid
        }))
    };
}


async function getClassesBySemesterAndSubject(semester, subjectcode) {
    const semesterRecord = await db.Semesterlist.findOne({ where: { semester } }); //findone in semesterlisttable
    if (!semesterRecord) throw new Error(`Semester ${semester} not found`);

    const subjectRecord = await db.Subjectlist.findOne({ where: { subjectcode } }); //findone in subjectlisttable
    if (!subjectRecord) throw new Error(`Subject ${subjectcode} not found`);

    const classList = await db.Classlist.findAll({
        where: { semester: semesterRecord.semester, subjectcode: subjectRecord.subjectcode },
        include: [
            { model: db.Semesterlist, as: 'ClassListBySemester', attributes: ['semester'] }, // Use the correct alias and attribut
            { model: db.Subjectlist, as: 'ClassListBySubject', attributes: ['subjectcode'] } // Use the correct alias and attribute
        ],
        attributes: ['year', 'classid']
    });

    return { //  response object Structure
        semester: semesterRecord.semester,
        subjectcode: subjectRecord.subjectcode,      
        ClassListbySemesterAndSubject: classList.map(({ classid, year }) => ({
            classid,
            year
        }))
    };
}



// async function getClassesByYearAndSemesterAndSubject(year, semester, subjectcode) {
//     // Find the year record
//     const yearRecord = await db.Yearlist.findOne({ where: { year } });
//     if (!yearRecord) throw new Error(`Year ${year} not found`);

//     // Find the semester record
//     const semesterRecord = await db.Semesterlist.findOne({ where: { semester } });
//     if (!semesterRecord) throw new Error(`Semester ${semester} not found`);

//     // Find the subject record
//     const subjectRecord = await db.Subjectlist.findOne({ where: { subjectcode } });
//     if (!subjectRecord) throw new Error(`Subject ${subjectcode} not found`);

//     // Fetch classes based on the year, semester, and subject
//     const classList = await db.Classlist.findAll({
//         where: {year: yearRecord.year, semester: semesterRecord.semester, subjectcode: subjectRecord.subjectcode
//         },
//         include: [
//             { model: db.Yearlist, as: 'ClassListByYear', attributes: ['year'] },
//             { model: db.Semesterlist, as: 'ClassListBySemester', attributes: ['semester'] },
//             { model: db.Subjectlist, as: 'ClassListBySubject', attributes: ['subjectcode'] }
//         ],
//         attributes: ['classid']
//     });

//     // Return the response object
//     return {
//         year: yearRecord.year,
//         semester: semesterRecord.semester,
//         subjectcode: subjectRecord.subjectcode,
//         ClassListByYearSemesterAndSubject: classList.map(({ classid }) => ({
//             classid
//         }))
//     };
// }


async function getClassesByYearAndSemesterAndSubject(year, semester, subjectcode) {
    // Helper function to find a record or throw an error
    const findRecord = async (model, field, value) => {
        const record = await model.findOne({ where: { [field]: value } });
        if (!record) throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} ${value} not found`);
        return record;
    };

    // Find all records
    const [yearRecord, semesterRecord, subjectRecord] = await Promise.all([
        findRecord(db.Yearlist, 'year', year),
        findRecord(db.Semesterlist, 'semester', semester),
        findRecord(db.Subjectlist, 'subjectcode', subjectcode)
    ]);

    // Fetch classes
    const classList = await db.Classlist.findAll({
        where: {
            year: yearRecord.year,
            semester: semesterRecord.semester,
            subjectcode: subjectRecord.subjectcode
        },
        include: [
            { model: db.Yearlist, as: 'ClassListByYear', attributes: ['year'] },
            { model: db.Semesterlist, as: 'ClassListBySemester', attributes: ['semester'] },
            { model: db.Subjectlist, as: 'ClassListBySubject', attributes: ['subjectcode'] }
        ],
        attributes: ['classid']
    });

    // Return the response object
    return {
        year: yearRecord.year,
        semester: semesterRecord.semester,
        subjectcode: subjectRecord.subjectcode,
        ClassListByYearSemesterAndSubject: classList.map(({ classid }) => ({ classid }))
    };
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