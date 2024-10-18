const bcrypt = require("bcryptjs");

async function initializeData(db) {
    try {

        const existingDataCheck = await Promise.all([
            db.Account.findAll(),
            db.Yearlist.findAll(),
            db.Semesterlist.findAll(),
            db.Subjectlist.findAll(),
            // db.Classlist.findAll(),        
            db.Studentlist.findAll()
        ]);
        
        const [accountData, yearlisttData, semesterlistData, subjectlistData, studentlistData] = existingDataCheck;
        
        if (accountData.length > 0 || yearlisttData.length > 0 || semesterlistData.length > 0 || subjectlistData.length > 0 || studentlistData.length > 0) {
            console.log("\n\n\n\nSample data already exists in one or more tables, skipping insertion.\n\n\n\n");
            return; // Exit the function if data exists in any of the tables
        }
        const password123123 = await bcrypt.hash("123123", 10);

  await db.Account.bulkCreate([
 { id: 1, username: "XavAdmin", passwordHash: password123123 ,firstName: "Marc", lastName: "Xavier", role: "Admin", isActive: true,  isDeleted: false},
 { id: 2, username: "XavRegistar", passwordHash: password123123 ,firstName: "XavRegistar", lastName: "Account", role: "Registrar", isActive: true,  isDeleted: false},
 { id: 3, username: "XavTeacher", passwordHash: password123123 ,firstName: "Marc", lastName: "Xavier", role: "Teacher", isActive: true,  isDeleted: false},
 { id: 4, username: "Xav1", passwordHash: password123123 ,firstName: "Marc", lastName: "XavierStudent", role: "Student", isActive: true,  isDeleted: false},
//  { username: "user1", passwordHash: password123123, firstName: "John", lastName: "Doe", role: "Student", isActive: true, isDeleted: false },
//  { username: "user2", passwordHash: password123123, firstName: "Jane", lastName: "Smith", role: "Student", isActive: true, isDeleted: false },
//  { username: "user3", passwordHash: password123123, firstName: "Emily", lastName: "Johnson", role: "Student", isActive: true, isDeleted: false },
//  { username: "user4", passwordHash: password123123, firstName: "Michael", lastName: "Brown", role: "Student", isActive: true, isDeleted: false },
//  { username: "user5", passwordHash: password123123, firstName: "Sarah", lastName: "Davis", role: "Student", isActive: true, isDeleted: false },
//  { username: "user6", passwordHash: password123123, firstName: "David", lastName: "Martinez", role: "Student", isActive: true, isDeleted: false },
//  { username: "user7", passwordHash: password123123, firstName: "Ashley", lastName: "Garcia", role: "Student", isActive: true, isDeleted: false },
//  { username: "user8", passwordHash: password123123, firstName: "Joshua", lastName: "Miller", role: "Student", isActive: true, isDeleted: false },
//  { username: "user9", passwordHash: password123123, firstName: "Amanda", lastName: "Wilson", role: "Student", isActive: true, isDeleted: false },
//  { username: "user10", passwordHash: password123123, firstName: "Daniel", lastName: "Moore", role: "Student", isActive: true, isDeleted: false },
//  { username: "user11", passwordHash: password123123, firstName: "Stephanie", lastName: "Taylor", role: "Student", isActive: true, isDeleted: false },
//  { username: "user12", passwordHash: password123123, firstName: "Matthew", lastName: "Anderson", role: "Student", isActive: true, isDeleted: false },
//  { username: "user13", passwordHash: password123123, firstName: "Elizabeth", lastName: "Thomas", role: "Student", isActive: true, isDeleted: false },
//  { username: "user14", passwordHash: password123123, firstName: "Andrew", lastName: "Harris", role: "Student", isActive: true, isDeleted: false },
//  { username: "user15", passwordHash: password123123, firstName: "Jessica", lastName: "Clark", role: "Student", isActive: true, isDeleted: false },
//  { username: "user16", passwordHash: password123123, firstName: "Brian", lastName: "Lewis", role: "Student", isActive: true, isDeleted: false },
//  { username: "user17", passwordHash: password123123, firstName: "Michelle", lastName: "Robinson", role: "Student", isActive: true, isDeleted: false },
//  { username: "user18", passwordHash: password123123, firstName: "Christopher", lastName: "Walker", role: "Student", isActive: true, isDeleted: false },
//  { username: "user19", passwordHash: password123123, firstName: "Brittany", lastName: "Perez", role: "Student", isActive: true, isDeleted: false },
//  { username: "user20", passwordHash: password123123, firstName: "Jason", lastName: "Hall", role: "Student", isActive: true, isDeleted: false },
          ]);
      
          await db.Subjectlist.bulkCreate([
            { subjectcode: 'FILIT', title: 'The Philippine Society in the IT Era' },
            { subjectcode: 'IT110', title: 'Introduction to Computing' },
            { subjectcode: 'IT111', title: 'Computer Programming I' },
            { subjectcode: 'IT120', title: 'Discrete Structures' },
            { subjectcode: 'IT121', title: 'Computer Programming II' },
            { subjectcode: 'IT210', title: 'Data Structures & Algorithm' },
            { subjectcode: 'IT211', title: 'Web Design & Development' },
            { subjectcode: 'IT212', title: 'Digital Logic Design' },
            { subjectcode: 'IT213', title: 'PC Assembly & Troubleshooting' },
            { subjectcode: 'IT220', title: 'Object-Oriented Programming' },
            { subjectcode: 'IT221', title: 'Networking' },
            { subjectcode: 'IT222', title: 'Database Management' },
            { subjectcode: 'IT223', title: 'Information Management' },
            { subjectcode: 'IT310', title: 'Applications & Development and Emerging Technologies' },
            { subjectcode: 'IT311', title: 'Operating Systems' },
            { subjectcode: 'IT312', title: 'Human Computer Interaction' },
            { subjectcode: 'IT320', title: 'System Analysis & Design' },
            { subjectcode: 'IT321', title: 'Information Assurance & Security' },
            { subjectcode: 'IT322', title: 'Systems Integration & Architecture' },
            { subjectcode: 'IT323', title: 'Capstone Project 1' },
            { subjectcode: 'IT324', title: 'Quantitative Methods' },
            { subjectcode: 'IT410', title: 'Capstone Project II' },
            { subjectcode: 'IT411', title: 'Integrative Programming & Technologies' },
            { subjectcode: 'IT412', title: 'Systems Administration & Maintenance' },
            { subjectcode: 'IT420', title: 'IT Seminars & Tours' },
            { subjectcode: 'ITELEC1', title: 'IT Elective 1' },
            { subjectcode: 'ITELEC2', title: 'IT Elective II' },
            { subjectcode: 'ITELEC3', title: 'IT Elective III' },
            { subjectcode: 'ITTEL1', title: 'IT Track Elective' },
            { subjectcode: 'ITTEL2', title: 'IT Track Elective II' },
            { subjectcode: 'OJT', title: 'On the Job Training (100000 Hours)' },
            { subjectcode: 'TECHNO', title: 'Technopreneurship' }
          ]);
          
          await db.Semesterlist.bulkCreate([
            { semester: '1st' },
            { semester: '2nd' },
            { semester: 'Summer' },
          
          ]);
        

          await db.Yearlist.bulkCreate([
            { year: '2023-2024' },
            { year: '2024-2025' },
            { year: '2025-2026' },
            { year: '2026-2027' },
            { year: '2027-2028' },
            { year: '2028-2029' },
            { year: '2029-2030' },
            { year: '2030-2031' },
            { year: '2031-2032' },
            { year: '2032-2033' },
            { year: '2033-2034' },
            { year: '2034-2035' },
            // { year: '2035-2036' },
            // { year: '2036-2037' },
            // { year: '2037-2038' },
            // { year: '2038-2039' },
            // { year: '2039-2040' },
            // { year: '2040-2041' },
            // { year: '2041-2042' },
            // { year: '2042-2043' },
            // { year: '2043-2044' },
            // { year: '2044-2045' },
            // { year: '2045-2046' },
            // { year: '2046-2047' },
            // { year: '2047-2048' },
            // { year: '2048-2049' },
            // { year: '2049-2050' }
          ]);
          
        // // Set SQL_MODE to allow 0 as primary key
        // await db.sequelize.query('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
        // console.log("SQL_MODE set to NO_AUTO_VALUE_ON_ZERO successfully.");

        // // Insert data into `subjectlists`
        // const [subjectResults] = await db.sequelize.query(`
        //     SELECT COUNT(*) as count FROM \`subjectlists\` WHERE \`subjectcode\` IN (
        //         'FILIT', 'IT110', 'IT111', 'IT120', 'IT121', 'IT210', 'IT211', 'IT212', 
        //         'IT213', 'IT220', 'IT221', 'IT222', 'IT223', 'IT310', 'IT311', 'IT312', 
        //         'IT320', 'IT321', 'IT322', 'IT323', 'IT324', 'IT410', 'IT411', 'IT412', 
        //         'IT420', 'ITELEC1', 'ITELEC2', 'ITELEC3', 'ITTEL1', 'ITTEL2', 'OJT', 'TECHNO'
        //     );
        // `);

        // if (subjectResults[0].count === 0) {
        //     await db.sequelize.query(`
                // INSERT INTO \`subjectlists\` (\`subjectcode\`, \`title\`)
                // VALUES 
                // ('FILIT', 'The Philippine Society in the IT Era'),
                // ('IT110', 'Introduction to Computing'),
                // ('IT111', 'Computer Programming I'),
                // ('IT120', 'Discrete Structures'),
                // ('IT121', 'Computer Programming II'),
                // ('IT210', 'Data Structures & Algorithm'),
                // ('IT211', 'Web Design & Development'),
                // ('IT212', 'Digital Logic Design'),
                // ('IT213', 'PC Assembly & Troubleshooting'),
                // ('IT220', 'Object-Oriented Programming'),
                // ('IT221', 'Networking'),
                // ('IT222', 'Database Management'),
                // ('IT223', 'Information Management'),
                // ('IT310', 'Applications & Development and Emerging Technologies'),
                // ('IT311', 'Operating Systems'),
                // ('IT312', 'Human Computer Interaction'),
                // ('IT320', 'System Analysis & Design'),
                // ('IT321', 'Information Assurance & Security'),
                // ('IT322', 'Systems Integration & Architecture'),
                // ('IT323', 'Capstone Project 1'),
                // ('IT324', 'Quantitative Methods'),
                // ('IT410', 'Capstone Project II'),
                // ('IT411', 'Integrative Programming & Technologies'),
                // ('IT412', 'Systems Administration & Maintenance'),
                // ('IT420', 'IT Seminars & Tours'),
                // ('ITELEC1', 'IT Elective 1'),
                // ('ITELEC2', 'IT Elective II'),
                // ('ITELEC3', 'IT Elective III'),
                // ('ITTEL1', 'IT Track Elective'),
                // ('ITTEL2', 'IT Track Elective II'),
                // ('OJT', 'On the Job Training (100000 Hours)'),
                // ('TECHNO', 'Technopreneurship');
        //     `);
        //     console.log("Initial subject data inserted successfully.");
        // } else {
        //     console.log("Subject data already exists. No insertion needed.");
        // }

        // // Insert data into `accounts`
        // const [accountResults] = await db.sequelize.query(`
        //     SELECT COUNT(*) as count FROM \`accounts\` WHERE \`id\` IN (0, 1, 2, 3, 4);
        // `);

        // if (accountResults[0].count === 0) {
        //     await db.sequelize.query(`
        //         INSERT INTO \`accounts\` (\`id\`, \`username\`, \`passwordHash\`, \`firstName\`, \`lastName\`, \`role\`, \`resetToken\`, \`resetTokenExpires\`, \`passwordReset\`, \`created\`, \`updated\`, \`dateDeleted\`, \`isActive\`, \`isDeleted\`, \`dateReactivated\`)
        //         VALUES 
        //         (0, 'DummyUser', '2a$10$wNuY/1tXaRv2ZWvsf/8FjOHYocj4ZgiDWgHZduxGRNZdP53Xn/o.6', 'Dummy', 'User', 'Student', NULL, NULL, NULL, '2024-08-23 02:54:06', NULL, NULL, 1, 0, NULL),
        //         (1, 'XavAdmin', '$2a$10$wNuY/1tXaRv2ZWvsf/8FjOHYocj4ZgiDWgHZduxGRNZdP53Xn/o.6', 'Marc', 'Xavier', 'Admin', NULL, NULL, NULL, '2024-08-23 02:54:06', '2024-08-25 17:39:57', '2024-08-24 16:29:09', 1, 0, '2024-08-24 17:00:59'),
        //         (2, 'XavTeacher', '$2a$10$tw6D5F5WUFdtXqrIqnZXM.BaHnW2VnALCFgIplMtLHQdhk5AODgnu', 'TeacherAcc', 'TestXav', 'Teacher', NULL, NULL, NULL, '2024-08-23 17:04:21', '2024-08-30 05:13:50', '2024-08-30 05:13:33', 1, 0, '2024-08-30 05:13:50'),
        //         (3, 'XavStudent', '$2a$10$oBZ0QZAlkvaXHkowIbjVq.mlbvkNA.fhxLb0SBxbZGV.zMiuOZ9D.', 'XavTest', 'StudentAccUpdate', 'Student', NULL, NULL, NULL, '2024-08-24 14:36:16', '2024-08-27 13:19:55', '2024-08-27 11:25:26', 1, 0, '2024-08-27 13:19:55'),
        //         (4, 'XavRegistar', '$2a$10$0378e9nKHAzXbKw/Q3FybeQ4NWAIVwidtZThimnFRX0BIIoq9ab5u', 'XavRegistrar', 'asdaSD', 'Registrar', NULL, NULL, NULL, '2024-08-25 13:22:37', '2024-08-27 13:49:28', '2024-08-25 18:58:21', 1, 0, '2024-08-27 11:24:52');
        //     `);
        //     console.log("Initial account data inserted successfully.");
        // } else {
        //     console.log("Account data already exists. No insertion needed.");
        // }

        // // Insert data into `semesterlists`
        // const [semesterResults] = await db.sequelize.query(`
        //     SELECT COUNT(*) as count FROM \`semesterlists\` WHERE \`semester\` IN ('1st', '2nd', 'Summer');
        // `);

        // if (semesterResults[0].count === 0) {
        //     await db.sequelize.query(`
        //         INSERT INTO \`semesterlists\` (\`semester\`)
        //         VALUES 
        //         ('1st'),
        //         ('2nd'),
        //         ('Summer');
        //     `);
        //     console.log("Initial semester data inserted successfully.");
        // } else {
        //     console.log("Semester data already exists. No insertion needed.");
        // }

        // // Insert data into `yearlists`
        // const [yearResults] = await db.sequelize.query(`
        //     SELECT COUNT(*) as count FROM \`yearlists\` WHERE \`year\` IN 
        //     ('2023-2024', '2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029', '2029-2030', '2030-2031', '2031-2032', '2032-2033', '2033-2034', '2034-2035');
        // `);

        // if (yearResults[0].count === 0) {
        //     await db.sequelize.query(`
                // INSERT INTO \`yearlists\` (\`year\`)
                // VALUES 
                // ('2023-2024'),
                // ('2024-2025'),
                // ('2025-2026'),
                // ('2026-2027'),
                // ('2027-2028'),
                // ('2028-2029'),
                // ('2029-2030'),
                // ('2030-2031'),
                // ('2031-2032'),
                // ('2032-2033'),
                // ('2033-2034'),
                // ('2034-2035');
        //     `);
        //     console.log("Initial year data inserted successfully.");
        // } else {
        //     console.log("Year data already exists. No insertion needed.");
        // }

        // // Reset SQL_MODE to its default value
        // await db.sequelize.query('SET SQL_MODE = "";');
        // console.log("SQL_MODE reset to default successfully.");

    } catch (error) {
        console.error("Error inserting initial data:", error);
    }
}

module.exports = initializeData;
