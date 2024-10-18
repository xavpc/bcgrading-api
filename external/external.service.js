// external.service.js

const axios = require("axios"); // Use axios for HTTP requests
const db = require("_helpers/db"); // Ensure db.Classlist is correctly loaded
const bcrypt = require("bcryptjs"); // Use bcrypt for hashing passwords

const MISUrlClass =
  "https://node-mysql-signup-verification-api.onrender.com/external/get-class-active/?campusName=Mandaue%20Campus";
const MISUrlEmployee =
  "https://node-mysql-signup-verification-api.onrender.com/external/get-employee-active/?campusName=Mandaue%20Campus&role=Instructor";

module.exports = {
  FetchClasses,
  FetchEmployees, // New function
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

    // Map fetched data to the db.Classlist model
    const classesToInsert = fetchedClasses.map((classData) => ({
      classid: classData.class_id,
      subjectcode: classData.subjectCode,
      semester: classData.semesterName,
      year: classData.schoolYear,
      teacherid: classData.employee_id,
      schedule: classData.schedule,
      isActive: true, // Default to true
      isDeleted: false, // Default to false
    }));

    // Insert the mapped data into db.Classlist (sequelize model)
    const insertedClasses = await db.Classlist.bulkCreate(classesToInsert, {
      updateOnDuplicate: [
        "subjectcode",
        "semester",
        "year",
        "teacherid",
        "schedule",
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
      message: `Classes fetched and inserted successfully! (Fetched ${fetchedClasses.length} classes from MISUrlClass and inserted ${insertedClasses.length} classes into the database)`,
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
