const db = require('_helpers/db');
const { Op } = require('sequelize');
module.exports = {

  getAll,
  getAllYear,
  getAllSemester,
  getAllSubject,
  getAllTeacher,
 

  addNewClass,
  addSubject,

  addStudentToClass,

  getStudentsInClass,
  getByID,
  getAllStudentsNotInClass




};


// async function getAll() {
//     const [allclass] = await db.sequelize.query(`
//         SELECT 
//             cl.classid,cl.subjectcode,cl.semester,cl.year,cl.teacherid,cl.created,cl.updated,cl.dateDeleted,cl.dateReactivated,cl.isActive,cl.isDeleted,sl.title FROM Classlists cl LEFT JOIN Subjectlists sl ON cl.subjectcode = sl.subjectcode;
//     `);

//     // Optionally, log the allclass to see the output
//     // console.log(allclass);

//     // Return the results
//     return allclass;
// }
async function getAll() {
    return await db.Classlist.findAll({
        include: [
        //     {
        //     model: db.Subjectlist,
        //     as: 'Subjectitle',
        //     attributes: ['title'] 
        // },
        {
            model: db.Account,
            as: 'TeacherInfo', 
            attributes: ['id', 'firstName', 'lastName']
        }]
    });
  }

  async function getAllStudent() {
    return await db.Account.findAll({
    });
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


async function getAllTeacher() {
    return await db.Account.findAll({
        where: { role: 'Teacher' },
        as: 'TeacherInfo', 
        attributes: ['id', 'firstName', 'lastName']
    });
}

async function getByID(classid) {
    return await db.Classlist.findOne({
        where: { classid: classid },
        attributes: ['classid', 'subjectcode', 'semester', 'year', 'teacherid', 'start', 'end','day'],
        include: [
        //     {
        //     model: db.Subjectlist,
        //     as: 'Subjectitle',
        //     attributes: ['title'] 
        // },
        {
            model: db.Account,
            as: 'TeacherInfo', 
            attributes: ['id', 'firstName', 'lastName']
        }]
    });
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
        classDetails: addclass,

    };
}









async function addSubject(params) {
    const addsubject = await db.Subjectlist.create(params);
    return {
        message: "New SUBJECT added successfully",
        details: addsubject
    };
}




// async function addStudentToClass(params) {
//     const { studentid, classid } = params;

//     // try {
//         // Validate that the student exists and has the role 'Student'
//         const student = await db.Account.findOne({
//             where: {
//                 id: studentid,
//                 role: 'Student'
//             }
//         });

//         if (!student) {
//             throw new Error(`Student with studentid ${studentid} not found or is not a student.`);
//         }

//         // Validate that the class exists
//         const classRecord = await db.Classlist.findOne({
//             where: { classid: classid }
//         });

//         if (!classRecord) {
//             throw new Error(`Class with id ${classid} not found.`);
//         }

//         // Check if the student is already in the class
//         const existingEntry = await db.Studentlist.findOne({
//             where: {
//                 studentid: studentid,
//                 classid: classid
//             }
//         });

//         if (existingEntry) {
//             return {
//                 message: `Student with id ${studentid} is already enrolled in class with id ${classid}.`,
//                 classDetails: existingEntry.get(),  // Return plain object for existing entry
//             };
//         }

//         // Create a new student entry in the class
//         const addstudent = await db.Studentlist.create(params);

//         return {    
//             StudentAddedToClassDetails: addstudent  // Return the plain object (dataValues)
//         };


// }




async function addStudentToClass(params) {
    const { studentid, classid } = params;

    // Validate that the student exists and has the role 'Student'
    const student = await db.Account.findOne({
        where: {
            id: studentid,
            role: 'Student'
        }
    });

    if (!student) {
        throw new Error(`Student with studentid ${studentid} not found or is not a student.`);
    }

    // Validate that the class exists
    const classRecord = await db.Classlist.findOne({
        where: { classid: classid }
    });

    if (!classRecord) {
        throw new Error(`Class with id ${classid} not found.`);
    }

    // Check if the student is already in the class
    const existingEntry = await db.Studentlist.findOne({
        where: {
            studentid: studentid,
            classid: classid
        }
    });

    if (existingEntry) {
        return {
            message: `Student with id ${studentid} is already enrolled in class with id ${classid}.`,
            classDetails: existingEntry.get(),  // Return plain object for existing entry
        };
    }

    // Create a new student entry in the class
    const addstudent = await db.Studentlist.create(params);

    // Find all existing Gradelist entries for the class
    const existingGrades = await db.Gradelist.findAll({
        where: { classid: classid }
    });

    // Create Scorelist entries for the newly added student for each Gradelist entry
    const scorelistEntries = [];
    for (const grade of existingGrades) {
        const scoreEntry = await db.Scorelist.create({
            gradeid: grade.gradeid,          // Reference the existing grade entry
            studentgradeid: addstudent.studentgradeid, // Reference the newly added student
            attendanceDate: grade.attendanceDate,
            term: grade.term,                // Copy term from the grade
            scoretype: grade.scoretype,      // Copy scoretype from the grade
            score: 0,                        // Initialize score as 0 (can be updated later)
            perfectscore: grade.perfectscore // Copy perfectscore from the grade
        });
        scorelistEntries.push(scoreEntry);  // Store the entry for response
    }

    return {
        message: "Student added to class successfully with associated score entries.",
        StudentAddedToClassDetails: addstudent, // Return student details
        ScoreEntries: scorelistEntries          // Return newly created scorelist entries
    };
}








































async function getStudentsInClass(classid) {
    try {
        const classRecord = await db.Classlist.findOne({
            where: { classid: classid }
        });

        if (!classRecord) {
            throw new Error(`Class with id ${classid} not found.`);
        }

        const students = await db.Studentlist.findAll({
            where: { classid: classid },
            include: [
                {
                    model: db.Account, // Assuming the Studentlist has a relation to Account for student details
                    as: 'studentinfo', // Alias for Account model
                    attributes: ['firstName', 'lastName', 'id'] // Specify fields to include
                }
            ]
        });

        if (students.length === 0) {
            return {
                message: `No students found for class with id ${classid}.`
            };
        }

        return {
            message: `Students retrieved successfully for class with id ${classid}.`,
            students: students.map(student => student.get({ plain: true }))
        };

    } catch (error) {
        console.error('Error retrieving students for class:', error);
        throw new Error('Failed to retrieve students for class.');
    }
}





async function getAllStudentsNotInClass(classid) {
    try {
        // Fetch all student IDs that are in the specified class (classid) in Studentlist
        const studentsInClass = await db.Studentlist.findAll({
            attributes: ['studentid'], // Only get studentid
            where: {
                classid: classid // Only include the students in the specific class
            },
            raw: true // Return raw data, so you only get the studentid
        });

        // Extract just the student IDs
        const studentIdsInClass = studentsInClass.map(record => record.studentid);

        // Fetch all student accounts where role is "Student" and studentid is not in the specified classid
        const studentsNotInClass = await db.Account.findAll({
            where: {
                role: 'Student', // Only students with role "Student"
                id: { 
                    [Op.notIn]: studentIdsInClass // Exclude student IDs that are in the class
                }
            },
            attributes: ['id', 'firstName', 'lastName'] // Adjust the attributes as needed
        });

        return studentsNotInClass;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}