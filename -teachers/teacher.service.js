const db = require('_helpers/db');

module.exports = {

  getAll,
  getStudentsInClass,
  addNewGrade,
  addNewAttendance,
  getAllYear,
  getAllSemester,
  getAllSubject,
  getPrelimAttendance,
  getPrelimParticipation,
  getPrelimQuiz,
  getPrelimActivity,
  getPrelimExam,
  getMidtermAttendance,
  getMidtermParticipation,
  getMidtermQuiz,
  getMidtermActivity,
  getMidtermExam,
  getFinalAttendance,
  getFinalParticipation,
  getFinalQuiz,
  getFinalActivity, 
  getFinalExam,
  getGradeList,

};



// async function getAll() {
//   return await db.Classlist.findAll({
//       include: [{
//           model: db.Subjectlist,
//           as: 'Subjectitle',
//           attributes: ['title'] 
//       }]
//   });
// }


async function getAll(teacherid) {
    return await db.Classlist.findAll({
        where: { teacherid: teacherid },
        include: [{
            model: db.Subjectlist,
            as: 'Subjectitle',
            attributes: ['title'] // Include only the title attribute from Subjectlist
        },
        {
            model: db.Account,
            as: 'TeacherInfo',
            attributes: ['firstName', 'lastName'] // Include only the title attribute from Subjectlist
        }
    ]
    });
  }

  async function getAllYear(teacherid) {
    return await db.Classlist.findAll({
        where: { teacherid: teacherid },
        attributes: ['year'],
        group: ['year'] 
    });
}
async function getAllSemester(teacherid) {
    return await db.Classlist.findAll({
        where: { teacherid: teacherid },
        attributes: ['semester'],
        group: ['semester'] 
    });
}
async function getAllSubject(teacherid) {
    return await db.Classlist.findAll({
        where: { teacherid: teacherid },
        attributes: ['subjectcode'],
        group: ['subjectcode'],
        include: [{
            model: db.Subjectlist,
            as: 'Subjectitle',
            attributes: ['title'],
            group: ['title'],
        }]
    });
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



// async function addNewGrade(params) {
//   // Destructure the parameters
//   const { classid } = params;

//   // Validate the year
//   const classRecord = await db.Classlist.findOne({
//       where: { classid: classid }
//   });
//   if (!classRecord) {
//       throw new Error(`Class with ID: ${classid} not found`);
//   }

//   // If all validations pass, create the new class entry
//   const newGrade = await db.Gradelist.create(params);

//   return newGrade; 
// }

async function addNewGrade(params) {
  const { classid, term, scoretype, perfectscore } = params;

  // Validate that the class exists
  const classRecord = await db.Classlist.findOne({ where: { classid: classid } });
  if (!classRecord) {
      throw new Error(`Class with ID: ${classid} not found`);
  }

  // Find all students in the same class
  const studentsInClass = await db.Studentlist.findAll({ where: { classid: classid } });

  if (studentsInClass.length === 0) {
      throw new Error(`No students found in class with ID: ${classid}`);
  }

  // Create the new grade entry in Gradelist
  const newGrade = await db.Gradelist.create({
      classid: classid,
      term: term,
      scoretype: scoretype,
      perfectscore: perfectscore,
  });

  // Loop over each student and create an entry in Scorelist for each one
  const scorelistEntries = [];
  for (const student of studentsInClass) {
      const scoreEntry = await db.Scorelist.create({
        gradeid: newGrade.gradeid,
        studentgradeid: student.studentgradeid,
        term: newGrade.term,           // Using the term from the newGrade entry
        scoretype: newGrade.scoretype, // Using the scoretype from the newGrade entry
        score: 0,
        perfectscore: newGrade.perfectscore
      });
      scorelistEntries.push(scoreEntry); // Store the entry for response
  }

  return {
      message: "Grade added successfully for all students in the class",
      gradeDetails: newGrade,
      scoreEntries: scorelistEntries,
  };
}


async function addNewAttendance(params) {
    const { classid, attendanceDate, term, scoretype} = params;
  
    // Validate that the class exists
    const classRecord = await db.Classlist.findOne({ where: { classid: classid } });
    if (!classRecord) {
        throw new Error(`Class with ID: ${classid} not found`);
    }
  
    // Find all students in the same class
    const studentsInClass = await db.Studentlist.findAll({ where: { classid: classid } });
  
    if (studentsInClass.length === 0) {
        throw new Error(`No students found in class with ID: ${classid}`);
    }
  
    // Create the new grade entry in Gradelist
    const newGrade = await db.Gradelist.create({
        classid: classid,
        attendanceDate: attendanceDate,
  
        term: term,
        scoretype: scoretype,
        perfectscore: 10,
    });
  
    // Loop over each student and create an entry in Scorelist for each one
    const scorelistEntries = [];
    for (const student of studentsInClass) {
        const scoreEntry = await db.Scorelist.create({
          gradeid: newGrade.gradeid,
          studentgradeid: student.studentgradeid,
          attendanceDate: newGrade.attendanceDate,
          term: newGrade.term,           // Using the term from the newGrade entry
          scoretype: newGrade.scoretype, // Using the scoretype from the newGrade entry
          score: 0,
          perfectscore: newGrade.perfectscore
        });
        scorelistEntries.push(scoreEntry); // Store the entry for response
    }
  
    return {
        message: "Grade added successfully for all students in the class",
        gradeDetails: newGrade,
        scoreEntries: scorelistEntries,
    };
  }





async function getPrelimAttendance(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            scoretype: 'Attendance'  
        }
    });
}
async function getPrelimParticipation(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            scoretype: 'Participation'  
        }
    });
}

async function getPrelimQuiz(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            scoretype: 'Quiz'  
        }
    });
}
async function getPrelimActivity(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            scoretype: 'Activity'  
        }
    });
}

async function getPrelimExam(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            scoretype: 'Exam'  
        }
    });
}
//////////



async function getMidtermAttendance(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            scoretype: 'Attendance'  
        }
    });
}
async function getMidtermParticipation(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            scoretype: 'Participation'  
        }
    });
}

async function getMidtermQuiz(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            scoretype: 'Quiz'  
        }
    });
}
async function getMidtermActivity(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            scoretype: 'Activity'  
        }
    });
}

async function getMidtermExam(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            scoretype: 'Exam'  
        }
    });
}
/////////


async function getFinalAttendance(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            scoretype: 'Attendance'  
        }
    });
}
async function getFinalParticipation(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            scoretype: 'Participation'  
        }
    });
}

async function getFinalQuiz(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            scoretype: 'Quiz'  
        }
    });
}
async function getFinalActivity(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            scoretype: 'Activity'  
        }
    });
}

async function getFinalExam(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            scoretype: 'Exam'  
        }
    });
}


async function getGradeList(gradeid) {
    return await db.Scorelist.findAll({
        where: { gradeid: gradeid },
        include: [
            {
                model: db.Studentlist, // Include Studentlist
                attributes: ['studentgradeid','studentid'], // Include only 'studentgradeid' from Studentlist
                include: [
                    {
                        model: db.Account, // Include Account model for student details
                        as: 'studentinfo', // Alias for Account
                        attributes: ['firstName', 'lastName', 'id'] // Specify fields to include from Account
                    }
                ]
            }
        ]
    });
}
