// external.service.js

const axios = require("axios"); // Use axios for HTTP requests
const db = require("_helpers/db"); // Ensure db.Classlist is correctly loaded
const bcrypt = require("bcryptjs"); // Use bcrypt for hashing passwords
const {
  computeGrade,
  computeGradeMidterm,
  computeGradeFinal,
} = require('-teachers/teacher.service');

const MISUrlClass =
  "https://benedicto-scheduling-backend.onrender.com/teachers/all-subjects";
const MISUrlEmployee =
  "https://node-mysql-signup-verification-api.onrender.com/external/get-employee-active/?campusName=Mandaue%20Campus&role=Instructor";

  const MISEnrolledStudents = 
  "https://node-mysql-signup-verification-api.onrender.com/enrollment/external/all-enrolled-classes"
module.exports = {
  FetchClasses,
  FetchEmployees, // New function
  FetchEnrolled,
  getAllGrades, // get all grades of students 
  getGradesbyStudentID,
  getGradesbyStudentPersonalID
};

async function FetchClasses() {
  try {
    // Fetch data from MISUrlClass
    const response = await axios.get(MISUrlClass);
    const fetchedClasses = response.data; // Assuming the data is directly in the response body

    if (!Array.isArray(fetchedClasses)) {
      throw new Error("Invalid response format");
    }

    // Log how many classes were fetched
    console.log(
      `\nFetched ${fetchedClasses.length} classes from MISUrlClass\n`
    );

    // Fetch all valid teacher IDs from the accounts table
    const validTeacherIds = await db.Account.findAll({
      attributes: ["id"],
    }).then((accounts) => accounts.map((account) => account.id));

    // Filter out classes with invalid teacher IDs
    const classesToInsert = fetchedClasses
      .filter((classData) => validTeacherIds.includes(classData.teacher_id))
      .map((classData) => ({
        classid: classData.id,
        subjectcode: classData.subject_code,
        semester: classData.semester,
        year: classData.school_year,
        teacherid: classData.teacher_id,
        start: classData.start,
        end: classData.end,
        day: classData.day,
        isActive: true, // Default to true
        isDeleted: false, // Default to false
      }));

    // Log how many classes were filtered
    console.log(
      `\nFiltered ${fetchedClasses.length - classesToInsert.length} classes due to invalid teacher IDs\n`
    );

    if (classesToInsert.length === 0) {
      throw new Error("No valid classes to insert after filtering.");
    }

    // Insert the mapped data into db.Classlist (sequelize model)
    const insertedClasses = await db.Classlist.bulkCreate(classesToInsert, {
      updateOnDuplicate: [
        "subjectcode",
        "semester",
        "year",
        "teacherid",
        "start",
        "end",
        "day",
        "isActive",
        "isDeleted",
      ],
    });

    // Log how many classes were inserted into the database
    console.log(
      `\nInserted ${insertedClasses.length} classes into the database\n`
    );

    // Return a message with the details of the operation
    return {
      message: `Classes fetched and inserted successfully! (Fetched ${fetchedClasses.length} classes from MISUrlClass, filtered ${fetchedClasses.length - classesToInsert.length} invalid entries, and inserted ${insertedClasses.length} classes into the database)`,
    };
  } catch (error) {
    console.error("Error fetching or inserting classes:", error);
    throw new Error("Failed to fetch or insert classes");
  }
}









async function FetchEmployees() {
  try {
    // Fetch employee data from MISUrlEmployee
    const response = await axios.get(MISUrlEmployee);
    const fetchedEmployees = response.data; // Assuming the data is directly in the response body

    if (!Array.isArray(fetchedEmployees)) {
      throw new Error("Invalid response format");
    }

    // Log how many employees were fetched
    console.log(
      `\nFetched ${fetchedEmployees.length} employees from MISUrlEmployee\n`
    );

    // Map fetched data to the db.Account model
    const employeesToInsert = await Promise.all(
      fetchedEmployees.map(async (employeeData) => {
        const hashedPassword = await bcrypt.hash("123", 10); // Hashing the default password "123"

        return {
          id: employeeData.employee_id, // Set the id field to the employee_id from fetched data
          username: `${employeeData.firstName}Teacher`, // Construct username as firstName + "Teacher"
          passwordHash: hashedPassword, // Store hashed password
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          role: "Teacher", // Default role is "Teacher"
          isActive: employeeData.isActive, // Use the isActive field from the fetched data
          isDeleted: employeeData.isDeleted, // Use the isDeleted field from the fetched data
        };
      })
    );

    // Insert the mapped data into db.Account (Sequelize model)
    const insertedEmployees = await db.Account.bulkCreate(employeesToInsert, {
      updateOnDuplicate: [
        "firstName",
        "lastName",
        "role",
        "isActive",
        "isDeleted",
      ],
    });

    // Log how many employees were inserted into the database
    console.log(
      `\nInserted ${insertedEmployees.length} employees into the database\n`
    );

    // Return a message with the details of the operation
    return {
      message: `Employees fetched and inserted successfully! (Fetched ${fetchedEmployees.length} employees from MISUrlEmployee and inserted ${insertedEmployees.length} employees into the database)`,
    };
  } catch (error) {
    console.error("Error fetching or inserting employees:", error);
    throw new Error("Failed to fetch or insert employees");
  }
}


async function FetchEnrolled() {
  try {
    // Fetch data from MISUrlClass
    const response = await axios.get(MISEnrolledStudents);
    const enrolled = response.data; // Assuming the data is directly in the response body

    if (!Array.isArray(enrolled)) {
      throw new Error("Invalid response format");
    }

    // Log how many classes were fetched
    console.log(
      `\nFetched ${enrolled.length} enrollments from MISUrlClass\n`
    );

    // Map fetched data to the db.Classlist model
    const datatoInsert = enrolled.map((classData) => ({
      studentgradeid: classData.student_class_id,
      student_id: classData.student_id,
      student_personal_id: classData.student_personal_id,
      studentName: classData.studentName,
      classid: classData.class_id,
     
    }));

    // Insert the mapped data into db.Classlist (sequelize model)
    const insertedEnrollData = await db.Studentlist.bulkCreate(datatoInsert, {
      updateOnDuplicate: [
        "studentgradeid",
        // "student_id",
        // "student_personal_id",
        // "studentName",
        // "classid",
     
      ],
    });

    // Log how many classes were inserted into the database
    console.log(
      `\nInserted ${insertedEnrollData.length} enrolled students into the database\n`
    );

    // Return a message with the details of the operation
    return {
      message: `Enrollments fetched and inserted successfully! (Fetched ${enrolled.length} Enrollments from MISUrlClass and inserted ${insertedEnrollData.length} enrollments into the database)`,
    };
  } catch (error) {
    console.error("Error fetching or inserting enrollements:", error);
    throw new Error("Failed to fetch or insert enrollments");
  }
}


async function getAllGrades(classid) {
  try {
      // Validate that the class exists
      const classRecord = await db.Classlist.findOne({
          where: { classid: classid },
          attributes: ['classid', 'subjectcode', 'semester', 'year'],
      });

      if (!classRecord) {
          throw new Error(`Class with id ${classid} not found.`);
      }
    

      // Fetch all students associated with the class and their computed grades
      const studentsWithGrades = await db.Studentlist.findAll({
          where: { classid: classid },
          attributes: ['studentgradeid', 'studentName', 'student_id', 'student_personal_id'],
          include: [
              {
                  model: db.ComputedGradelist,
                  attributes: ['term', 'finalcomputedgrade', 'transmutedgrade'],
                  where: { term: ['Prelim', 'Midterm', 'Final'] },
                  required: false, // Include students without computed grades
              },
          ],
      });

      // Compute grades for each student
      const students = [];
      for (const student of studentsWithGrades) {
          const { studentgradeid } = student;

          // Compute Prelim, Midterm, and Final grades for the student
          await computeGrade(studentgradeid, 'Prelim');
          await computeGradeMidterm(studentgradeid);
          await computeGradeFinal(studentgradeid);

          // Reduce ComputedGradelist to map Prelim, Midterm, and Final grades
          const grades = student.ComputedGradelists.reduce(
              (acc, grade) => {
                  acc[grade.term] = grade.transmutedgrade;
                  return acc;
              },
              { Prelim: '5.0', Midterm: '5.0', Final: '5.0' } // Default values if no grades exist
          );

          students.push({
              // studentgradeid: student.studentgradeid,
              subjectcode: classRecord.subjectcode,
              semester: classRecord.semester,
              year: classRecord.year,
              studentName: student.studentName,
              student_id: student.student_id,
              student_personal_id: student.student_personal_id,
              grades,
          });
      }

      return {
          message: `Students and computed grades retrieved successfully for class with id ${classid}.`,
          students,
      };
  } catch (error) {
      console.error('Error retrieving students for class:', error);
      throw new Error('Failed to retrieve students for class.');
  }
}


async function getGradesbyStudentID(student_id) {
  try {
      // Fetch all students associated with the class and their computed grades
      const studentsWithGrades = await db.Studentlist.findAll({
          where: { student_id: student_id },
          attributes: ['studentgradeid', 'studentName', 'student_id', 'student_personal_id'],
          include: [
              {
                  model: db.ComputedGradelist,
                  attributes: ['term', 'finalcomputedgrade', 'transmutedgrade'],
                  where: { term: ['Prelim', 'Midterm', 'Final'] },
                  required: false, // Include students without computed grades
              },
              {
                model: db.Classlist,
                attributes: ['classid', 'subjectcode', 'semester', 'year'],
              }
          ],
      });

      if (!studentsWithGrades) {
        throw new Error(`Class with id ${student_id} not found.`);
    }

      // Compute grades for each student
      const students = [];
      for (const student of studentsWithGrades) {
          const { studentgradeid } = student;

          // Compute Prelim, Midterm, and Final grades for the student
          await computeGrade(studentgradeid, 'Prelim');
          await computeGradeMidterm(studentgradeid);
          await computeGradeFinal(studentgradeid);

          // Reduce ComputedGradelist to map Prelim, Midterm, and Final grades
          const grades = student.ComputedGradelists.reduce(
              (acc, grade) => {
                  acc[grade.term] = grade.transmutedgrade;
                  return acc;
              },
              { Prelim: '5.0', Midterm: '5.0', Final: '5.0' } // Default values if no grades exist
          );

          students.push({
              studentgradeid: student.studentgradeid,
              studentName: student.studentName,
              subjectcode: student.externalclasslist?.subjectcode,
              semester: student.externalclasslist?.semester,
              year: student.externalclasslist?.year,
              grades,
          });
      }

      return {
          message: `Studentcomputed grades retrieved for student id: ${student_id}.`,
          students,
      };
  } catch (error) {
      console.error('Error retrieving students for class:', error);
      throw new Error('Failed to retrieve students for class.');
  }
}


async function getGradesbyStudentPersonalID(student_personal_id) {
  try {
      // Fetch all students associated with the class and their computed grades
      const studentsWithGrades = await db.Studentlist.findAll({
          where: { student_personal_id: student_personal_id },
          attributes: ['studentgradeid', 'studentName', 'student_id', 'student_personal_id'],
          include: [
              {
                  model: db.ComputedGradelist,
                  attributes: ['term', 'finalcomputedgrade', 'transmutedgrade'],
                  where: { term: ['Prelim', 'Midterm', 'Final'] },
                  required: false, // Include students without computed grades
              },
              {
                model:db.Classlist,
                attributes: ['classid', 'subjectcode', 'semester', 'year'],
              }
          ],
      });

      if (!studentsWithGrades) {
        throw new Error(`grades for studentpersonalid ${student_personal_id} not found.`);
    }

      // Compute grades for each student
      const students = [];
      for (const student of studentsWithGrades) {
          const { studentgradeid } = student;

          // Compute Prelim, Midterm, and Final grades for the student
          await computeGrade(studentgradeid, 'Prelim');
          await computeGradeMidterm(studentgradeid);
          await computeGradeFinal(studentgradeid);

          // Reduce ComputedGradelist to map Prelim, Midterm, and Final grades
          const grades = student.ComputedGradelists.reduce(
              (acc, grade) => {
                  acc[grade.term] = grade.transmutedgrade;
                  return acc;
              },
              { Prelim: '5.0', Midterm: '5.0', Final: '5.0' } // Default values if no grades exist
          );

          students.push({
            studentgradeid: student.studentgradeid,
            studentName: student.studentName,
            subjectcode: student.externalclasslist?.subjectcode,
            semester: student.externalclasslist?.semester,
            year: student.externalclasslist?.year,
            grades,
           
          });
      }

      return {
          message: `Student computed grades retrieved successfully for studentpersonalid: ${student_personal_id}.`,
          students,
      };
  } catch (error) {
      console.error('Error retrieving students for class:', error);
      throw new Error('Failed to retrieve students for class.');
  }
}
