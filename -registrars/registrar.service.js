const db = require('_helpers/db');

module.exports = {

  getAll,
  getAllYear,
  getAllSemester,
  getAllSubject,


  addNewClass,
  addSubject,

  addStudentToClass,


  getClassGradesAndAttendance




};


async function getAll() {
    const [allclass] = await db.sequelize.query(`
        SELECT 
            cl.classid,cl.subjectcode,cl.semester,cl.year,cl.teacherid,cl.created,cl.updated,cl.dateDeleted,cl.dateReactivated,cl.isActive,cl.isDeleted,sl.title FROM Classlists cl LEFT JOIN Subjectlists sl ON cl.subjectcode = sl.subjectcode;
    `);

    // Optionally, log the allclass to see the output
    // console.log(allclass);

    // Return the results
    return allclass;
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






// async function addNewClass(params) {
//     // Destructure the parameters
//     const { year, semester, subjectcode } = params;

//     // Validate the year
//     const yearRecord = await db.Yearlist.findOne({
//         where: { year: year }
//     });
//     if (!yearRecord) {
//         throw new Error(`Year ${year} not found`);
//     }

//     // Validate the semester
//     const semesterRecord = await db.Semesterlist.findOne({
//         where: { semester: semester }
//     });
//     if (!semesterRecord) {
//         throw new Error(`Semester ${semester} not found`);
//     }

//     // Validate the subject code
//     const subjectRecord = await db.Subjectlist.findOne({
//         where: { subjectcode: subjectcode }
//     });
//     if (!subjectRecord) {
//         throw new Error(`Subject code ${subjectcode} not found`);
//     }

//     // If all validations pass, create the new class entry
//     const addclass = await db.Classlist.create(params);

//    return {
//     message: "New class added successfully",
//     details: addclass
// };
// }


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

    // Prepare the terms
    const terms = ['Prelim', 'Midterm', 'Finals'];

    // Generate entries for Gradelist, Attendancescores, Participationscores, Quizscores, ActivityProjectscores, and Examscores
    const gradelistEntries = [];
    const attendanceEntries = [];
    const participationEntries = [];
    const quizEntries = [];
    const activityProjectEntries = [];
    const examEntries = [];

    for (const term of terms) {
        // Create an attendance entry
        const attendance = await db.Attendancescores.create({
            isReference: true,
            classid: addclass.classid
        });

        // Create a participation entry
        const participation = await db.Participationscores.create({
            isReference: true,
            classid: addclass.classid
        });

        // Create a quiz entry
        const quiz = await db.Quizscores.create({
            isReference: true,
            classid: addclass.classid
        });

        // Create an activity/project entry
        const activityProject = await db.ActivityProjectscores.create({
            isReference: true,
            classid: addclass.classid
        });

        // Create an exam entry
        const exam = await db.Examscores.create({
            isReference: true,
            classid: addclass.classid
        });

        // Create a gradelist entry linked to all the score entries
        const gradelist = await db.Gradelist.create({
            studentFirstName: 'First Name',
            studentLastName: 'Last Name',
            studentid: 0,
            term: term,
            classid: addclass.classid,
            attendanceid: attendance.attendanceid,
            participationid: participation.participationid,
            quizid: quiz.quizid,
            activityprojectid: activityProject.activityprojectid,
            examid: exam.examid
        });

        gradelistEntries.push(gradelist);
        attendanceEntries.push(attendance);
        participationEntries.push(participation);
        quizEntries.push(quiz);
        activityProjectEntries.push(activityProject);
        examEntries.push(exam);
    }

    return {
        message: "New class and associated grade and attendance reference entries added successfully",
        classDetails: addclass,
        gradelistEntries: gradelistEntries,
        attendanceEntries: attendanceEntries,
        participationEntries: participationEntries,
        quizEntries: quizEntries,
        activityProjectEntries: activityProjectEntries,
        examEntries: examEntries
    };
}









async function addSubject(params) {
    const addsubject = await db.Subjectlist.create(params);
    return {
        message: "New SUBJECT added successfully",
        details: addsubject
    };
}




async function addStudentToClass({ classid, studentid }) {
    try {
        // Validate that the student exists and has the role 'Student'
        const student = await db.Account.findOne({
            where: {
                id: studentid,
                role: 'Student'
            }
        });

        if (!student) {
            throw new Error(`Student with id ${studentid} not found or is not a student.`);
        }

        // Validate that the class exists
        const classRecord = await db.Classlist.findOne({
            where: { classid: classid }
        });

        if (!classRecord) {
            throw new Error(`Class with id ${classid} not found.`);
        }

        // Check how many terms the student already has in this class
        const existingEntries = await db.Gradelist.findAll({
            where: {
                classid: classid,
                studentid: studentid
            }
        });

        if (existingEntries.length >= 3) {
            return {
                message: "This student already has entries for all three terms (Prelim, Midterm, Finals) in this class.",
                classDetails: classRecord,
                existingEntries: existingEntries
            };
        }

        // Prepare the terms that have not yet been added
        const existingTerms = existingEntries.map(entry => entry.term);
        const terms = ['Prelim', 'Midterm', 'Finals'].filter(term => !existingTerms.includes(term));

        // Generate entries for Gradelist, Attendancescores, Participationscores, Quizscores, ActivityProjectscores, and Examscores
        const gradelistEntries = [];
        const attendanceEntries = [];
        const participationEntries = [];
        const quizEntries = [];
        const activityProjectEntries = [];
        const examEntries = [];

        for (const term of terms) {
            // Create an attendance entry
            const attendance = await db.Attendancescores.create({
                classid: classRecord.classid
            });

            // Create a participation entry
            const participation = await db.Participationscores.create({
                classid: classRecord.classid
            });

            // Create a quiz entry
            const quiz = await db.Quizscores.create({
                classid: classRecord.classid
            });

            // Create an activity/project entry
            const activityProject = await db.ActivityProjectscores.create({
                classid: classRecord.classid
            });

            // Create an exam entry
            const exam = await db.Examscores.create({
                classid: classRecord.classid
            });

            // Create a gradelist entry linked to all the score entries
            const gradelist = await db.Gradelist.create({
                studentFirstName: student.firstName, // Use student's first name
                studentLastName: student.lastName,   // Use student's last name
                studentid: student.id,               // Use the provided studentid
                term: term,
                classid: classRecord.classid,
                attendanceid: attendance.attendanceid,
                participationid: participation.participationid,
                quizid: quiz.quizid,
                activityprojectid: activityProject.activityprojectid,
                examid: exam.examid
            });

            gradelistEntries.push(gradelist);
            attendanceEntries.push(attendance);
            participationEntries.push(participation);
            quizEntries.push(quiz);
            activityProjectEntries.push(activityProject);
            examEntries.push(exam);
        }

        return {
            message: "Student added to class successfully with associated grade and attendance entries.",
            classDetails: classRecord,
            gradelistEntries: gradelistEntries,
            attendanceEntries: attendanceEntries,
            participationEntries: participationEntries,
            quizEntries: quizEntries,
            activityProjectEntries: activityProjectEntries,
            examEntries: examEntries
        };
    } catch (error) {
        console.error("Error adding student to class:", error);
        throw error;
    }
}







async function getClassGradesAndAttendance(classid) {
    try {
        // Validate that the class exists
        const classRecord = await db.Classlist.findOne({
            where: { classid: classid }
        });

        if (!classRecord) {
            throw new Error(`Class with id ${classid} not found.`);
        }

        // Get all Gradelist entries for the class
        const gradelistEntries = await db.Gradelist.findAll({
            where: { classid: classid },
            include: [{
                model: db.Attendancescores,
                as: 'AttendanceScore', // Assuming you've set up associations with alias
                required: false // Set to false to allow Gradelist entries without Attendancescores
            }]
        });

        if (gradelistEntries.length === 0) {
            return {
                message: "No grade data found for this class.",
                classDetails: classRecord
            };
        }

        return {
            message: "Grade and attendance data retrieved successfully.",
            classDetails: classRecord,
            gradelistEntries: gradelistEntries
        };
    } catch (error) {
        console.error("Error retrieving class grades and attendance:", error);
        throw error;
    }
}