async function initializeData(db) {
    try {
        // Set SQL_MODE to allow 0 as primary key
        await db.sequelize.query('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
        console.log("SQL_MODE set to NO_AUTO_VALUE_ON_ZERO successfully.");

        // Insert data into `subjectlists`
        const [subjectResults] = await db.sequelize.query(`
            SELECT COUNT(*) as count FROM \`subjectlists\` WHERE \`subjectcode\` IN (
                'FILIT', 'IT110', 'IT111', 'IT120', 'IT121', 'IT210', 'IT211', 'IT212', 
                'IT213', 'IT220', 'IT221', 'IT222', 'IT223', 'IT310', 'IT311', 'IT312', 
                'IT320', 'IT321', 'IT322', 'IT323', 'IT324', 'IT410', 'IT411', 'IT412', 
                'IT420', 'ITELEC1', 'ITELEC2', 'ITELEC3', 'ITTEL1', 'ITTEL2', 'OJT', 'TECHNO'
            );
        `);

        if (subjectResults[0].count === 0) {
            await db.sequelize.query(`
                INSERT INTO \`subjectlists\` (\`subjectcode\`, \`title\`)
                VALUES 
                ('FILIT', 'The Philippine Society in the IT Era'),
                ('IT110', 'Introduction to Computing'),
                ('IT111', 'Computer Programming I'),
                ('IT120', 'Discrete Structures'),
                ('IT121', 'Computer Programming II'),
                ('IT210', 'Data Structures & Algorithm'),
                ('IT211', 'Web Design & Development'),
                ('IT212', 'Digital Logic Design'),
                ('IT213', 'PC Assembly & Troubleshooting'),
                ('IT220', 'Object-Oriented Programming'),
                ('IT221', 'Networking'),
                ('IT222', 'Database Management'),
                ('IT223', 'Information Management'),
                ('IT310', 'Applications & Development and Emerging Technologies'),
                ('IT311', 'Operating Systems'),
                ('IT312', 'Human Computer Interaction'),
                ('IT320', 'System Analysis & Design'),
                ('IT321', 'Information Assurance & Security'),
                ('IT322', 'Systems Integration & Architecture'),
                ('IT323', 'Capstone Project 1'),
                ('IT324', 'Quantitative Methods'),
                ('IT410', 'Capstone Project II'),
                ('IT411', 'Integrative Programming & Technologies'),
                ('IT412', 'Systems Administration & Maintenance'),
                ('IT420', 'IT Seminars & Tours'),
                ('ITELEC1', 'IT Elective 1'),
                ('ITELEC2', 'IT Elective II'),
                ('ITELEC3', 'IT Elective III'),
                ('ITTEL1', 'IT Track Elective'),
                ('ITTEL2', 'IT Track Elective II'),
                ('OJT', 'On the Job Training (100000 Hours)'),
                ('TECHNO', 'Technopreneurship');
            `);
            console.log("Initial subject data inserted successfully.");
        } else {
            console.log("Subject data already exists. No insertion needed.");
        }

        // Insert data into `accounts`
        const [accountResults] = await db.sequelize.query(`
            SELECT COUNT(*) as count FROM \`accounts\` WHERE \`id\` IN (0, 1, 2, 3, 4);
        `);

        if (accountResults[0].count === 0) {
            await db.sequelize.query(`
                INSERT INTO \`accounts\` (\`id\`, \`username\`, \`passwordHash\`, \`firstName\`, \`lastName\`, \`role\`, \`resetToken\`, \`resetTokenExpires\`, \`passwordReset\`, \`created\`, \`updated\`, \`dateDeleted\`, \`isActive\`, \`isDeleted\`, \`dateReactivated\`)
                VALUES 
                (0, 'DummyUser', '2a$10$wNuY/1tXaRv2ZWvsf/8FjOHYocj4ZgiDWgHZduxGRNZdP53Xn/o.6', 'Dummy', 'User', 'Student', NULL, NULL, NULL, '2024-08-23 02:54:06', NULL, NULL, 1, 0, NULL),
                (1, 'XavAdmin', '$2a$10$wNuY/1tXaRv2ZWvsf/8FjOHYocj4ZgiDWgHZduxGRNZdP53Xn/o.6', 'Marc', 'Xavier', 'Admin', NULL, NULL, NULL, '2024-08-23 02:54:06', '2024-08-25 17:39:57', '2024-08-24 16:29:09', 1, 0, '2024-08-24 17:00:59'),
                (2, 'XavTeacher', '$2a$10$tw6D5F5WUFdtXqrIqnZXM.BaHnW2VnALCFgIplMtLHQdhk5AODgnu', 'TeacherAcc', 'TestXav', 'Teacher', NULL, NULL, NULL, '2024-08-23 17:04:21', '2024-08-30 05:13:50', '2024-08-30 05:13:33', 1, 0, '2024-08-30 05:13:50'),
                (3, 'XavStudent', '$2a$10$oBZ0QZAlkvaXHkowIbjVq.mlbvkNA.fhxLb0SBxbZGV.zMiuOZ9D.', 'XavTest', 'StudentAccUpdate', 'Student', NULL, NULL, NULL, '2024-08-24 14:36:16', '2024-08-27 13:19:55', '2024-08-27 11:25:26', 1, 0, '2024-08-27 13:19:55'),
                (4, 'XavRegistar', '$2a$10$0378e9nKHAzXbKw/Q3FybeQ4NWAIVwidtZThimnFRX0BIIoq9ab5u', 'XavRegistrar', 'asdaSD', 'Registrar', NULL, NULL, NULL, '2024-08-25 13:22:37', '2024-08-27 13:49:28', '2024-08-25 18:58:21', 1, 0, '2024-08-27 11:24:52');
            `);
            console.log("Initial account data inserted successfully.");
        } else {
            console.log("Account data already exists. No insertion needed.");
        }

        // Insert data into `semesterlists`
        const [semesterResults] = await db.sequelize.query(`
            SELECT COUNT(*) as count FROM \`semesterlists\` WHERE \`semester\` IN ('1st', '2nd', 'Summer');
        `);

        if (semesterResults[0].count === 0) {
            await db.sequelize.query(`
                INSERT INTO \`semesterlists\` (\`semester\`)
                VALUES 
                ('1st'),
                ('2nd'),
                ('Summer');
            `);
            console.log("Initial semester data inserted successfully.");
        } else {
            console.log("Semester data already exists. No insertion needed.");
        }

        // Insert data into `yearlists`
        const [yearResults] = await db.sequelize.query(`
            SELECT COUNT(*) as count FROM \`yearlists\` WHERE \`year\` IN 
            ('2023-2024', '2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029', '2029-2030', '2030-2031', '2031-2032', '2032-2033', '2033-2034', '2034-2035');
        `);

        if (yearResults[0].count === 0) {
            await db.sequelize.query(`
                INSERT INTO \`yearlists\` (\`year\`)
                VALUES 
                ('2023-2024'),
                ('2024-2025'),
                ('2025-2026'),
                ('2026-2027'),
                ('2027-2028'),
                ('2028-2029'),
                ('2029-2030'),
                ('2030-2031'),
                ('2031-2032'),
                ('2032-2033'),
                ('2033-2034'),
                ('2034-2035');
            `);
            console.log("Initial year data inserted successfully.");
        } else {
            console.log("Year data already exists. No insertion needed.");
        }

        // Reset SQL_MODE to its default value
        await db.sequelize.query('SET SQL_MODE = "";');
        console.log("SQL_MODE reset to default successfully.");

    } catch (error) {
        console.error("Error inserting initial data:", error);
    }
}

module.exports = initializeData;
