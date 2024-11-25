const bcrypt = require("bcryptjs");

async function initializeData(db) {
    try {

        const existingDataCheck = await Promise.all([
            db.Account.findAll(),
      
        ]);
        
        const [accountData] = existingDataCheck;
        
        if (accountData.length > 0) {
            console.log("\n\n\n\nSample data already exists in one or more tables, skipping insertion.\n\n\n\n");
            return; // Exit the function if data exists in any of the tables
        }
        const password123123 = await bcrypt.hash("123123", 10);

  await db.Account.bulkCreate([
 { id: 1876548, username: "XavAdmin", passwordHash: password123123 ,firstName: "Marc", lastName: "Xavier", role: "Admin", isActive: true,  isDeleted: false},
 { id: 286758567, username: "XavRegistar", passwordHash: password123123 ,firstName: "XavRegistar", lastName: "Account", role: "Registrar", isActive: true,  isDeleted: false},
 { id: 3456786758, username: "XavTeacher", passwordHash: password123123 ,firstName: "Marc", lastName: "Xavier", role: "Teacher", isActive: true,  isDeleted: false},
 { id: 45678567, username: "Xav1", passwordHash: password123123 ,firstName: "Marc", lastName: "XavierStudent", role: "Student", isActive: true,  isDeleted: false},
          ]);
  

    } catch (error) {
        console.error("Error inserting initial data:", error);
    }
}

module.exports = initializeData;
