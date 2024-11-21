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
  getGradesPrelim,
  getGradesMidterm,
  getGradesFinal,
  getAllGrades,
  updateAttendanceDate,
  getGradeInfo,
  updatePerfectScore,
  archiveGrade,
  computeGradeMidterm,
  computeGradeFinal
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
        attributes: ['classid', 'subjectcode', 'semester', 'year', 'teacherid', 'start', 'end','day'],
        include: [
        //     {
        //     model: db.Subjectlist,
        //     as: 'Subjectitle',
        //     attributes: ['title'] // Include only the title attribute from Subjectlist
        // },
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
        // include: [{
        //     model: db.Subjectlist,
        //     as: 'Subjectitle',
        //     attributes: ['title'],
        //     group: ['title'],
        // }]
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


async function addNewGrade(params) {
  const { classid, term, scoretype, perfectscore } = params;

  // Validate that the class exists
  const classRecord = await db.Classlist.findOne({ where: { classid: classid } });
  if (!classRecord) {
      throw new Error(`Class with ID: ${classid} not found`);
  }

  // Find all students in the same class
  const studentsInClass = await db.Studentlist.findAll({ where: { classid: classid }, attributes:['studentgradeid'] });

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
 
      await computeGrade(student.studentgradeid, term);
  
      await computeGradeMidterm(student.studentgradeid);
      await computeGradeFinal(student.studentgradeid);
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
            scoretype: scoretype,
            active: true
        }
    });

    if (existingAttendance) {
        const formattedDate = new Date(attendanceDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        throw new Error(`Attendance Date:${formattedDate} already exists for this class!`);
    }

    // Find all students in the same class
   const studentsInClass = await db.Studentlist.findAll({ where: { classid: classid }, attributes:['studentgradeid'] });

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
    
        await computeGrade(student.studentgradeid, term);
  
        await computeGradeMidterm(student.studentgradeid);
        await computeGradeFinal(student.studentgradeid);

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
        scoretype: scoretype,
        active: true
      }
    });
  
    if (existingGrade) {
      throw new Error(`Only 1 Major ${scoretype} allowed per term!!`);
    }
  
    // Find all students in the same class
   const studentsInClass = await db.Studentlist.findAll({ where: { classid: classid }, attributes:['studentgradeid'] });
  
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
   
      await computeGrade(student.studentgradeid, term);
  
      await computeGradeMidterm(student.studentgradeid);
      await computeGradeFinal(student.studentgradeid);
   
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
            active: true,
            scoretype: 'Attendance'  
        },
        order: [['attendanceDate', 'ASC']]
    });
}
async function getPrelimParticipation(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            active: true,
            scoretype: 'Participation'  
        }
    });
}

async function getPrelimQuiz(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            active: true,
            scoretype: 'Quiz'  
        }
    });
}
async function getPrelimActivity(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            active: true,
            scoretype: 'Activity-Project'  
        }
    });
}

async function getPrelimExam(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Prelim',
            active: true,
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
            active: true,
            scoretype: 'Attendance'  
        },
        order: [['attendanceDate', 'ASC']]
    });
}
async function getMidtermParticipation(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            active: true,
            scoretype: 'Participation'  
        }
    });
}

async function getMidtermQuiz(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            active: true,
            scoretype: 'Quiz'  
        }
    });
}
async function getMidtermActivity(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            active: true,
            scoretype: 'Activity-Project'  
        }
    });
}

async function getMidtermExam(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Midterm',
            active: true,
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
            active: true,
            scoretype: 'Attendance'  
        },
        order: [['attendanceDate', 'ASC']]
    });
}
async function getFinalParticipation(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            active: true,
            scoretype: 'Participation'  
        }
    });
}

async function getFinalQuiz(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            active: true,
            scoretype: 'Quiz'  
        }
    });
}
async function getFinalActivity(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            active: true,
            scoretype: 'Activity-Project'  
        }
    });
}

async function getFinalExam(classid) {
    return await db.Gradelist.findAll({
        where: { 
            classid: classid,
            term: 'Final',
            active: true,
            scoretype: 'Exam'  
        }
    });
}


async function getGradeList(gradeid) {
    return await db.Scorelist.findAll({
        where: { gradeid: gradeid, active: true },
        include: [
            {
                model: db.Studentlist, // Include Studentlist
                attributes: ['studentgradeid','student_id','student_personal_id','studentName' ], // Include only 'studentgradeid' from Studentlist
                // include: [
                //     {
                //         model: db.Account, // Include Account model for student details
                //         as: 'studentinfo', // Alias for Account
                //         attributes: ['firstName', 'lastName', 'id'] // Specify fields to include from Account
                //     }
                // ]
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

       // Recompute grades after score update
       try {
        const studentgradeid = attendancechange.studentgradeid; // Assuming Scorelist has a `studentgradeid`
        
        // Recompute Prelim, Midterm, or Final grades based on the term
        const term = attendancechange.term;

      
        // Recompute individual term grades
        await computeGrade(studentgradeid, term);
        await computeGradeMidterm(studentgradeid);
        await computeGradeFinal(studentgradeid);

    } catch (error) {
        console.error('Error re-computing grades:', error);
        throw new Error('Failed to recompute grades after score update.');
    }

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

      // Recompute grades after score update
      try {
        const studentgradeid = scorechange.studentgradeid; // Assuming Scorelist has a `studentgradeid`
       

        // Recompute Prelim, Midterm, or Final grades based on the term
        const term = scorechange.term;

        // Recompute individual term grades
        await computeGrade(studentgradeid, term);
        await computeGradeMidterm(studentgradeid);
        await computeGradeFinal(studentgradeid);
       

    } catch (error) {
        console.error('Error re-computing grades:', error);
        throw new Error('Failed to recompute grades after score update.');
    }


    return scorechange.get();
}


async function computeGrade(studentgradeid, term) {
    try {
        // Fetch attendance, participation, quiz, activity-project, exam records
        const attendanceRecords = await db.Scorelist.findAll({
            where: { studentgradeid: studentgradeid, scoretype: 'Attendance',term: term, active: true },
            include: [{ model: db.Gradelist,  attributes: ['classid'] }]
        });
       
        
        
        const participationRecords = await db.Scorelist.findAll({
            where: { studentgradeid: studentgradeid, scoretype: 'Participation', term: term, active: true },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        const quizRecords = await db.Scorelist.findAll({
            where: { studentgradeid: studentgradeid, scoretype: 'Quiz', term: term, active: true },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        const activityprojectRecords = await db.Scorelist.findAll({
            where: { studentgradeid: studentgradeid, scoretype: 'Activity-Project', term: term, active: true },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        const examRecords = await db.Scorelist.findAll({
            where: { studentgradeid: studentgradeid, scoretype: 'Exam', term: term, active: true },
            include: [{ model: db.Gradelist, attributes: ['classid'] }]
        });

        // Find classid from any of the records
        let classid = (attendanceRecords.length > 0 && attendanceRecords[0].Gradelist?.classid) ||
        (participationRecords.length > 0 && participationRecords[0].Gradelist?.classid) ||
        (quizRecords.length > 0 && quizRecords[0].Gradelist?.classid) ||
        (activityprojectRecords.length > 0 && activityprojectRecords[0].Gradelist?.classid) ||
        (examRecords.length > 0 && examRecords[0].Gradelist?.classid);


        if (!classid) {
            const studentRecord = await db.Studentlist.findOne({
                where: { studentgradeid: studentgradeid },
                attributes: ['classid']
            });
            classid = studentRecord?.classid;
        }
// if (!classid) {
// throw new Error(`No classid found in the score records for studentgradeid ${studentgradeid}`);
// }


        // Compute total scores and perfect scores for each category
        const totalattendance = attendanceRecords.length > 0 ? attendanceRecords.reduce((acc, record) => acc + record.score, 0) : 0;
        const perfectattendancescore = attendanceRecords.length > 0 ? attendanceRecords.reduce((acc, record) => acc + record.perfectscore, 0) : 0;
        

        const totalparticipation = participationRecords.length > 0 ? participationRecords.reduce((acc, record) => acc + record.score, 0) : 0;
        const perfectparticipationscore = participationRecords.length > 0 ? participationRecords.reduce((acc, record) => acc + record.perfectscore, 0) : 0;
        
        const totalquiz = quizRecords.length > 0 ? quizRecords.reduce((acc, record) => acc + record.score, 0) : 0;
        const perfectquizscore = quizRecords.length > 0 ? quizRecords.reduce((acc, record) => acc + record.perfectscore, 0) : 0;
        
        const totalactivityproject = activityprojectRecords.length > 0 ? activityprojectRecords.reduce((acc, record) => acc + record.score, 0) : 0;
        const perfectactivityprojectscore = activityprojectRecords.length > 0 ? activityprojectRecords.reduce((acc, record) => acc + record.perfectscore, 0) : 0;
        
        const totalexam = examRecords.length > 0 ? examRecords.reduce((acc, record) => acc + record.score, 0) : 0;
        const perfectexamscore = examRecords.length > 0 ? examRecords.reduce((acc, record) => acc + record.perfectscore, 0) : 0;
        

// Safely calculate percentages to avoid division by 0 or null, and limit to 2 decimal places
const attendance5percent = perfectattendancescore > 0 ? parseFloat(((totalattendance / perfectattendancescore) * 5).toFixed(2)) : 0;
const participation5percent = perfectparticipationscore > 0 ? parseFloat(((totalparticipation / perfectparticipationscore) * 5).toFixed(2)) : 0;
const quiz15percent = perfectquizscore > 0 ? parseFloat(((totalquiz / perfectquizscore) * 15).toFixed(2)) : 0;
const activityproject45percent = perfectactivityprojectscore > 0 ? parseFloat(((totalactivityproject / perfectactivityprojectscore) * 45).toFixed(2)) : 0;
const exam30percent = perfectexamscore > 0 ? parseFloat(((totalexam / perfectexamscore) * 30).toFixed(2)) : 0;

// Calculate final computed grade and limit to 2 decimal places
const finalcomputedgrade = parseFloat((attendance5percent + participation5percent + quiz15percent + activityproject45percent + exam30percent).toFixed(2));


        // Calculate transmuted grade
        let transmutedgrade = parseFloat((5 - (4 * (finalcomputedgrade - 1)) / 99).toFixed(1));
        


     
       
     
        
        // Check if an entry already exists in ComputedGradelist for the student and term
        const existingComputedGrade = await db.ComputedGradelist.findOne({
            where: { studentgradeid: studentgradeid, term: term }
        });

        if (existingComputedGrade) {
            // Update the existing record
            Object.assign(existingComputedGrade, {
                totalattendance,
                perfectattendancescore,
                attendance5percent,
                totalparticipation,
                perfectparticipationscore,
                participation5percent,
                totalquiz,
                perfectquizscore,
                quiz15percent,
                totalactivityproject,
                perfectactivityprojectscore,
                activityproject45percent,
                totalexam,
                perfectexamscore,
                exam30percent,
                finalcomputedgrade,
                transmutedgrade,
                updated: new Date()
            });
            await existingComputedGrade.save();
            return existingComputedGrade;
        } else {
            // Create a new entry in ComputedGradelist
            const newComputedGrade = await db.ComputedGradelist.create({
                classid,
                studentgradeid,
                term,
                totalattendance,
                perfectattendancescore,
                attendance5percent,
                totalparticipation,
                perfectparticipationscore,
                participation5percent,
                totalquiz,
                perfectquizscore,
                quiz15percent,
                totalactivityproject,
                perfectactivityprojectscore,
                activityproject45percent,
                totalexam,
                perfectexamscore,
                exam30percent,
                finalcomputedgrade,
                transmutedgrade,
                created: new Date(),
                updated: new Date()
            });
            return newComputedGrade;
        }
    } catch (error) {
        console.error('Error computing grade:', error);
        throw error;
    }
}

async function computeGradeMidterm(studentgradeid) {
    try {
        // Fetch Prelim transmuted grade
        const prelimTransmutedGradeRecord = await db.ComputedGradelist.findOne({
            where: {
                studentgradeid: studentgradeid,
                term: 'Prelim'
            },
            attributes: ['transmutedgrade']
        });

        if (!prelimTransmutedGradeRecord) {
            throw new Error(`No Prelim grade found for studentgradeid ${studentgradeid}`);
        }

        const prelimTransmutedGrade = prelimTransmutedGradeRecord.transmutedgrade;

        // Compute Midterm grade using computeGrade function
        const midtermComputedGradeRecord = await computeGrade(studentgradeid, 'Midterm');

        if (!midtermComputedGradeRecord) {
            throw new Error(`No Midterm grade found for studentgradeid ${studentgradeid}`);
        }

        const midtermTransmutedGrade = midtermComputedGradeRecord.transmutedgrade;

        // Calculate updated transmuted grade based on 1/3 Prelim and 2/3 Midterm transmuted grades
        const updatedTransmutedGrade = parseFloat(
            ((1 / 3 * prelimTransmutedGrade) + (2 / 3 * midtermTransmutedGrade)).toFixed(1)
        );

        // Update ComputedGradelist for Midterm with the new transmuted grade
        midtermComputedGradeRecord.transmutedgrade = updatedTransmutedGrade;
        await midtermComputedGradeRecord.save();

        return {
            message: `Midterm grade updated successfully with combined Prelim and Midterm transmuted grades.`,
            updatedTransmutedGrade: updatedTransmutedGrade
        };
    } catch (error) {
        console.error('Error computing Midterm grade:', error);
        throw error;
    }
}




async function computeGradeFinal(studentgradeid) {
    try {
        // Fetch Midterm transmuted grade
        const midtermTransmutedGradeRecord = await db.ComputedGradelist.findOne({
            where: {
                studentgradeid: studentgradeid,
                term: 'Midterm'
            },
            attributes: ['transmutedgrade']
        });

        if (!midtermTransmutedGradeRecord) {
            throw new Error(`No Midterm grade found for studentgradeid ${studentgradeid}`);
        }

        const midtermTransmutedGrade = midtermTransmutedGradeRecord.transmutedgrade;

        // Compute Final grade (this will calculate and return the ComputedGradelist for Final)
        const finalComputedGradeRecord = await computeGrade(studentgradeid, 'Final');

        if (!finalComputedGradeRecord) {
            throw new Error(`No Final grade found for studentgradeid ${studentgradeid}`);
        }

        const finalTransmutedGrade = finalComputedGradeRecord.transmutedgrade;

        // Calculate updated transmuted grade based  on 1/3 Midterm and 2/3 Final
        const updatedTransmutedGrade = parseFloat(
            ((1 / 3 * midtermTransmutedGrade) + (2 / 3 * finalTransmutedGrade)).toFixed(1)
        );

             // Update ComputedGradelist for Final with the new transmuted grade
             finalComputedGradeRecord.transmutedgrade = updatedTransmutedGrade;
             await finalComputedGradeRecord.save();

        return {
            message: `Final grade updated successfully with combined Midterm and Final grades.`,
          
            updatedTransmutedGrade: updatedTransmutedGrade
        };

    } catch (error) {
        console.error('Error computing Final grade:', error);
        throw error;
    }
}






async function getGradesPrelim(classid) {
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
            attributes: ['studentName'], 
            include: [
            
                {
                    model: db.ComputedGradelist, 
                    attributes: ['term','finalcomputedgrade','transmutedgrade'],
                    // attributes: ['studentgradeid', 'term', 'totalattendance', 'perfectattendancescore','attendance5percent', 'totalparticipation','perfectparticipationscore','participation5percent','totalquiz', 'perfectquizscore','quiz15percent','totalactivityproject', 'perfectactivityprojectscore','activityproject45percent', 'totalexam', 'perfectexamscore','exam30percent', 'finalcomputedgrade','transmutedgrade'],
                    where: { term: 'Prelim' },
                    required: false
                }
            ]
        });

        return {
            // message: `Students and computed grades retrieved successfully for class with id ${classid}.`,
            // message: `Students and computed grades retrieved successfully for class with id ${classid}.`,
            students: updatedStudents.map(student => student.get({ plain: true }))
        };

    } catch (error) {
        console.error('Error retrieving students for class:', error); 
        throw new Error('Failed to retrieve students for class.'); 
    }
}


async function getGradesMidterm(classid) {
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
        
        });

        if (students.length === 0) {
            return {
                message: `No students found for class with id ${classid}.`
            };
        }

        // Compute attendance grades for each student
     // Compute Midterm grades for each student
     for (const student of students) {
        await computeGrade(student.studentgradeid, 'Midterm'); // Compute Midterm grades first
        await computeGradeMidterm(student.studentgradeid, classid); // Combine Prelim and Midterm grades
    }

        // Refetch students with the updated ComputedGradelist
        const updatedStudents = await db.Studentlist.findAll({
            where: { classid: classid },
            attributes: ['studentName'],
            include: [
            
                {
                    model: db.ComputedGradelist, 
                    attributes: ['term','finalcomputedgrade','transmutedgrade'],
                    // attributes: ['studentgradeid', 'term', 'totalattendance', 'perfectattendancescore','attendance5percent', 'totalparticipation','perfectparticipationscore','participation5percent','totalquiz', 'perfectquizscore','quiz15percent','totalactivityproject', 'perfectactivityprojectscore','activityproject45percent', 'totalexam', 'perfectexamscore','exam30percent', 'finalcomputedgrade','transmutedgrade'],
                    where: { term: 'Midterm' },
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

async function getGradesFinal(classid) {
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
         
       
        });

        if (students.length === 0) {
            return {
                message: `No students found for class with id ${classid}.`
            };
        }

        // Compute attendance grades for each student
        for (const student of students) {
            await computeGrade(student.studentgradeid, 'Final'); 
            await computeGradeFinal(student.studentgradeid, classid);
        }

        // Refetch students with the updated ComputedGradelist
        const updatedStudents = await db.Studentlist.findAll({
            where: { classid: classid },
            
            attributes: ['studentName'],
            include: [
              
                {
                    model: db.ComputedGradelist, 
                    attributes: ['term','finalcomputedgrade','transmutedgrade'],
                    // attributes: ['studentgradeid', 'term', 'totalattendance', 'perfectattendancescore','attendance5percent', 'totalparticipation','perfectparticipationscore','participation5percent','totalquiz', 'perfectquizscore','quiz15percent','totalactivityproject', 'perfectactivityprojectscore','activityproject45percent', 'totalexam', 'perfectexamscore','exam30percent', 'finalcomputedgrade','transmutedgrade'],
                    where: { term: 'Final' },
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




async function getAllGrades(classid) {
    try {
      

        // Validate that the class exists
        const classRecord = await db.Classlist.findOne({
            where: { classid: classid },
            attributes: ['classid'],
        });

        if (!classRecord) {
            throw new Error(`Class with id ${classid} not found.`);
        }

      

        // Fetch all students associated with the class and their computed grades
        const studentsWithGrades = await db.Studentlist.findAll({
            where: { classid: classid },
            attributes: ['studentgradeid','studentName','student_id','student_personal_id'],
            include: [
                // {
                //     model: db.Account,
                //     as: 'studentinfo',
                //     attributes: ['firstName', 'lastName']
                // },
                {
                    model: db.ComputedGradelist,
                    attributes: ['term', 'finalcomputedgrade', 'transmutedgrade'],
                    where: {
                        term: ['Prelim', 'Midterm', 'Final']
                    },
                    required: false // This will include students without computed grades
                }
            ]
        });

        // Transform the data to return a simplified response
        const students = studentsWithGrades.map(student => {
            // Reduce ComputedGradelist to map Prelim, Midterm, and Final grades
            const grades = student.ComputedGradelists.reduce((acc, grade) => {
                acc[grade.term] = grade.transmutedgrade;
                return acc;
            }, { Prelim: '5.0', Midterm: '5.0', Final: '5.0' }); // Default value '5' if no grade exists

            return {
                // studentinfo: student.studentinfo,
                studentgradeid: student.studentgradeid,
                studentName: student.studentName,
                grades
            };
        });

        return {
            message: `Students and computed grades retrieved successfully for class with id ${classid}.`,
            students: students
        };

    } catch (error) {
        console.error('Error retrieving students for class:', error);
        throw new Error('Failed to retrieve students for class.');
    }
}


async function updateAttendanceDate(gradeid, params) {
    const attendancedatechange = await db.Gradelist.findByPk(gradeid);

    if (!attendancedatechange) {
        throw new Error(`Grade with ID ${gradeid} not found.`);
    }


    if (attendancedatechange.attendanceDate === params.attendanceDate) {
        throw new Error("You are trying to input the same date as the current attendance date.");
    }

    const existingAttendance = await db.Gradelist.findOne({
        where: {    
            attendanceDate: params.attendanceDate, 
            active: true
          
        }
    });

    if (existingAttendance) {
        const formattedDate = new Date(params.attendanceDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        throw new Error(`Attendance Date:${formattedDate} already exists for this class!`);
    }

    
    Object.assign(attendancedatechange, params);
   

    await attendancedatechange.save();

    return attendancedatechange.get();
     
}



async function getGradeInfo(gradeid) {
    return await db.Gradelist.findOne({
        where: { 
            gradeid: gradeid,
        }
        ,attributes: ['gradeid', 'classid', 'attendanceDate', 'perfectscore'] 
    });
}

async function updatePerfectScore(gradeid, params) {
    // Find the grade entry in Gradelist
    const gradeEntry = await db.Gradelist.findByPk(gradeid);

    if (!gradeEntry) {
        throw new Error(`Grade with ID ${gradeid} not found.`);
    }

    // Update the perfectscore in Gradelist
    gradeEntry.perfectscore = params.perfectscore;
    await gradeEntry.save();

    // Update all related Scorelist entries with the new perfectscore and set score to null
    await db.Scorelist.update(
        { perfectscore: params.perfectscore, score: 0 },
        { where: { gradeid: gradeid } }
    );

    try {
        const relatedScores = await db.Scorelist.findAll({
            where: { gradeid: gradeid },
            attributes: ['studentgradeid', 'term'],
            include: [
                {
                    model: db.Gradelist,
                    attributes: ['classid']
                }
            ]
        });

        for (const score of relatedScores) {
            const { studentgradeid, term } = score;
          

            // Recompute individual term grade
            await computeGrade(studentgradeid, term);

            // Recompute Midterm and Final grades based on term
         
                await computeGradeMidterm(studentgradeid);
                await computeGradeFinal(studentgradeid);
     
        }
    } catch (error) {
        console.error('Error re-computing grades after perfect score update:', error);
        throw new Error('Failed to recompute grades after perfect score update.');
    }


    return {
        message: "Perfect score updated successfully for the grade and all associated score entries.",
        gradeDetails: gradeEntry,
    };
}



async function archiveGrade(gradeid) {
    // Find the grade entry in Gradelist
    const deleteGrade = await db.Gradelist.findByPk(gradeid);

    if (!deleteGrade) {
        throw new Error(`Grade with ID ${gradeid} not found.`);
    }

    // Update the perfectscore in Gradelist
    deleteGrade.active = false;
    await deleteGrade.save();


    await db.Scorelist.update(
        { active: false },
        { where: { gradeid: gradeid } }
    );


    try {
        const relatedScores = await db.Scorelist.findAll({
            where: { gradeid: gradeid },
            attributes: ['studentgradeid', 'term'],
            include: [
                {
                    model: db.Gradelist,
                    attributes: ['classid']
                }
            ]
        });

        for (const score of relatedScores) {
            const { studentgradeid, term } = score;
          

            // Recompute individual term grade
            await computeGrade(studentgradeid, term);

            // Recompute Midterm and Final grades based on term
         
                await computeGradeMidterm(studentgradeid);
                await computeGradeFinal(studentgradeid);
     
        }
    } catch (error) {
        console.error('Error re-computing grades after perfect score update:', error);
        throw new Error('Failed to recompute grades after perfect score update.');
    }

    return {
        message: "Grade successfully deleted",
        gradeDetails: deleteGrade,
    };
}