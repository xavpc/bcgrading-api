const db = require('_helpers/db');

module.exports = {

  getAll,
  getStudentsInClass,
  addNewGrade,
  addNewAttendance,
  addNewExam,
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
  updateAttendance,
  updateScore,
  computeGrade,
  getStudentsInClassAttendancePrelim
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
    const { classid, attendanceDate, term, scoretype } = params;

    // Validate that the class exists
    const classRecord = await db.Classlist.findOne({ where: { classid: classid } });
    if (!classRecord) {
        throw new Error(`Class with ID: ${classid} not found`);
    }

    // Check if attendance for the same date, term, and class already exists
    const existingAttendance = await db.Gradelist.findOne({
        where: {
            classid: classid,
            attendanceDate: attendanceDate,
            // term: term,
            scoretype: scoretype
        }
    });

    if (existingAttendance) {
        const formattedDate = new Date(attendanceDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        throw new Error(`Attendance Date:${formattedDate} already exists for this class!`);
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
        message: "Attendance added successfully for all students in the class",
        gradeDetails: newGrade,
        scoreEntries: scorelistEntries,
    };
}



  async function addNewExam(params) {
    const { classid, term, scoretype, perfectscore } = params;
  
    // Validate that the class exists
    const classRecord = await db.Classlist.findOne({ where: { classid: classid } });
    if (!classRecord) {
      throw new Error(`Class with ID: ${classid} not found`);
    }
  
    // Check if a grade entry already exists for the same classid, term, and scoretype
    const existingGrade = await db.Gradelist.findOne({
      where: {
        classid: classid,
        term: term,
        scoretype: scoretype
      }
    });
  
    if (existingGrade) {
      throw new Error(`Only 1 Major ${scoretype} allowed per term!!`);
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
            scoretype: 'Activity-Project'  
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
            scoretype: 'Activity-Project'  
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
            scoretype: 'Activity-Project'  
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



async function updateAttendance(scoreid, params) {
    const attendancechange = await db.Scorelist.findByPk(scoreid);

    if (!attendancechange) {
        throw new Error(`Score entry with ID ${scoreid} not found.`);
    }

    // Update the attendanceStatus and score based on the new attendance status
    const { attendanceStatus } = params;

    switch (attendanceStatus) {
        case 'Present':
            attendancechange.score = 10;
            break;
        case 'Absent':
            attendancechange.score = 0;
            break;
        case 'Late':
            attendancechange.score = 7;
            break;
        case 'Excused':
            attendancechange.score = 5;
            break;
        default:
            throw new Error('Invalid attendance status');
    }

    // Assign any additional changes from params to the attendancechange object
    Object.assign(attendancechange, params);

    // Update the 'updated' timestamp
    attendancechange.updated = new Date();

    // Save the updated record
    await attendancechange.save();

    return attendancechange.get();
}


async function updateScore(scoreid, params) {
    const scorechange = await db.Scorelist.findByPk(scoreid);

    if (!scorechange) {
        throw new Error(`Score entry with ID ${scoreid} not found.`);
    }

    Object.assign(scorechange, params);

      // Check if the new score exceeds the perfectscore
      if (scorechange.score > scorechange.perfectscore) {
        throw new Error(`The score (${scorechange.score}) cannot be greater than the perfect score (${scorechange.perfectscore}).`);
    }

    scorechange.updated = new Date();

    await scorechange.save();

    return scorechange.get();
}


async function computeGrade(studentgradeid, term) {
    try {
        // Fetch all attendance records for the student for the given term
        const attendanceRecords = await db.Scorelist.findAll({
            where: {
                studentgradeid: studentgradeid,
                scoretype: 'Attendance',
                term: term
            },
            include: [
                {
                    model: db.Gradelist, // Include Gradelist to access classid
                    attributes: ['classid'] // Only fetch classid
                }
            ]
        });

        // Fetch other types of records (participation, quiz, activity-project, exam)
        const participationRecords = await db.Scorelist.findAll({
            where: {
                studentgradeid: studentgradeid,
                scoretype: 'Participation',
                term: term
            },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        const quizRecords = await db.Scorelist.findAll({
            where: {
                studentgradeid: studentgradeid,
                scoretype: 'Quiz',
                term: term
            },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        const activityprojectRecords = await db.Scorelist.findAll({
            where: {
                studentgradeid: studentgradeid,
                scoretype: 'Activity-Project',
                term: term
            },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        const examRecords = await db.Scorelist.findAll({
            where: {
                studentgradeid: studentgradeid,
                scoretype: 'Exam',
                term: term
            },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        // Find the classid from any of the records (attendance, participation, quiz, activity-project, or exam)
        const classid = attendanceRecords[0]?.Gradelist?.classid ||
                        participationRecords[0]?.Gradelist?.classid ||
                        quizRecords[0]?.Gradelist?.classid ||
                        activityprojectRecords[0]?.Gradelist?.classid ||
                        examRecords[0]?.Gradelist?.classid;

        if (!classid) {
            throw new Error(`No classid found in the score records for studentgradeid ${studentgradeid}`);
        }

        // Compute total scores and perfect scores for each category
        const totalattendance = attendanceRecords.reduce((acc, record) => acc + record.score, 0);
        const perfectattendancescore = attendanceRecords.reduce((acc, record) => acc + record.perfectscore, 0);

        const totalparticipation = participationRecords.reduce((acc, record) => acc + record.score, 0);
        const perfectparticipationscore = participationRecords.reduce((acc, record) => acc + record.perfectscore, 0);

        const totalquiz = quizRecords.reduce((acc, record) => acc + record.score, 0);
        const perfectquizscore = quizRecords.reduce((acc, record) => acc + record.perfectscore, 0);

        const totalactivityproject = activityprojectRecords.reduce((acc, record) => acc + record.score, 0);
        const perfectactivityprojectscore = activityprojectRecords.reduce((acc, record) => acc + record.perfectscore, 0);

        const totalexam = examRecords.reduce((acc, record) => acc + record.score, 0);
        const perfectexamscore = examRecords.reduce((acc, record) => acc + record.perfectscore, 0);

        // Calculate percentages based on weight
        const attendance5percent = (totalattendance / perfectattendancescore) * 5;
        const participation5percent = (totalparticipation / perfectparticipationscore) * 5;
        const quiz15percent = (totalquiz / perfectquizscore) * 15;
        const activityproject45percent = (totalactivityproject / perfectactivityprojectscore) * 45;
        const exam30percent = (totalexam / perfectexamscore) * 30;

        // Check if an entry already exists in ComputedGradelist for the student and term
        const existingComputedGrade = await db.ComputedGradelist.findOne({
            where: {
                studentgradeid: studentgradeid,
                term: term
            }
        });

        if (existingComputedGrade) {
            // Update the existing record
            existingComputedGrade.totalattendance = totalattendance;
            existingComputedGrade.perfectattendancescore = perfectattendancescore;
            existingComputedGrade.attendance5percent = attendance5percent;

            existingComputedGrade.totalparticipation = totalparticipation;
            existingComputedGrade.perfectparticipationscore = perfectparticipationscore;
            existingComputedGrade.participation5percent = participation5percent;

            existingComputedGrade.totalquiz = totalquiz;
            existingComputedGrade.perfectquizscore = perfectquizscore;
            existingComputedGrade.quiz15percent = quiz15percent;

            existingComputedGrade.totalactivityproject = totalactivityproject;
            existingComputedGrade.perfectactivityprojectscore = perfectactivityprojectscore;
            existingComputedGrade.activityproject45percent = activityproject45percent;

            existingComputedGrade.totalexam = totalexam;
            existingComputedGrade.perfectexamscore = perfectexamscore;
            existingComputedGrade.exam30percent = exam30percent;

            existingComputedGrade.updated = new Date();

            await existingComputedGrade.save();
            return existingComputedGrade;
        } else {
            // Create a new entry in ComputedGradelist
            const newComputedGrade = await db.ComputedGradelist.create({
                classid: classid, // Pass the classid here
                studentgradeid: studentgradeid,
                term: term,
                totalattendance: totalattendance,
                perfectattendancescore: perfectattendancescore,
                attendance5percent: attendance5percent,

                totalparticipation: totalparticipation,
                perfectparticipationscore: perfectparticipationscore,
                participation5percent: participation5percent,

                totalquiz: totalquiz,
                perfectquizscore: perfectquizscore,
                quiz15percent: quiz15percent,

                totalactivityproject: totalactivityproject,
                perfectactivityprojectscore: perfectactivityprojectscore,
                activityproject45percent: activityproject45percent,

                totalexam: totalexam,
                perfectexamscore: perfectexamscore,
                exam30percent: exam30percent,
            });

            return newComputedGrade;
        }
    } catch (error) {
        console.error('Error computing grade:', error);
        throw error;
    }
}




async function getStudentsInClassAttendancePrelim(classid) {
    try {
        // Validate that the class exists
        const classRecord = await db.Classlist.findOne({
            where: { classid: classid }
        });

        if (!classRecord) {
            throw new Error(`Class with id ${classid} not found.`);
        }

        // Fetch all students associated with the class
        const students = await db.Studentlist.findAll({
            where: { classid: classid },
            include: [
                {
                    model: db.Account, 
                    as: 'studentinfo', 
                    attributes: ['firstName', 'lastName', 'id'] 
                }
            ]
        });

        if (students.length === 0) {
            return {
                message: `No students found for class with id ${classid}.`
            };
        }

        // Compute attendance grades for each student
        for (const student of students) {
            await computeGrade(student.studentgradeid, 'Prelim'); 
        }

        // Refetch students with the updated ComputedGradelist
        const updatedStudents = await db.Studentlist.findAll({
            where: { classid: classid },
            include: [
                {
                    model: db.Account,
                    as: 'studentinfo',
                    attributes: ['firstName', 'lastName', 'id']
                },
                {
                    model: db.ComputedGradelist, 
                    attributes: ['studentgradeid', 'term', 'totalattendance', 'perfectattendancescore'],
                    where: { term: 'Prelim' },
                    required: false
                }
            ]
        });

        return {
            message: `Students and computed grades retrieved successfully for class with id ${classid}.`,
            students: updatedStudents.map(student => student.get({ plain: true }))
        };

    } catch (error) {
        console.error('Error retrieving students for class:', error); 
        throw new Error('Failed to retrieve students for class.'); 
    }
}




