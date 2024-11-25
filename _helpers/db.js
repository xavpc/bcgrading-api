//db.js
const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const initializeData = require('./initialize.js');

const db = {}; // Define db object

module.exports = db; // Export db object

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql', host: host, 
        define: {
        id: false,         // Disable default 'id' column globally
      }, });

     // Assign Sequelize instance to the db object 
     db.Sequelize = Sequelize;
     db.sequelize = sequelize;
     

    // init models and add them to the exported db object
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);

    // define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);
    


    //Not part of accounts db models
    // db.Yearlist = require('../-models/year.model.js')(sequelize);
    
    // db.Semesterlist = require('../-models/semester.model.js')(sequelize);

    // db.Subjectlist = require('../-models/subjects.model.js')(sequelize);

    // db.Classlist = require('../-models/classlist.model.js')(sequelize);

    db.Studentlist = require('../-grades/student.model.js')(sequelize);

    db.Gradelist = require('../-grades/grade.model.js')(sequelize);

    db.Scorelist = require('../-grades/score.model.js')(sequelize);

    db.ComputedGradelist = require('../-grades/computedgrade.model.js')(sequelize);

    db.Classlist = require("../-models/classlist_external.model.js")(sequelize);

    // sync all models with database first para di mag error     // await sequelize.sync();
    // await db.Account.sync(); 
    // await db.Yearlist.sync();
    // await db.Semesterlist.sync();
    // await db.Subjectlist.sync();
    // await db.Classlist.sync();
    // await db.Studentlist.sync();
    // await db.Gradelist.sync();
    // await db.Scorelist.sync();
    // await db.ComputedGradelist.sync();
    // await db.Yearlist.sync({ alter: true });
    // await db.Semesterlist.sync({ alter: true });
    // await db.Subjectlist.sync({ alter: true });
    // await db.Account.sync({ alter: true });
    // await db.Classlist.sync({ alter: true });
    // await db.Studentlist.sync({ alter: true });
    // await db.Gradelist.sync({ alter: true });
    // await db.Scorelist.sync({ alter: true });
    // await db.ComputedGradelist.sync({ alter: true });
    
    // Now add the relationships
    addRelationships();

    // ! Account --> Classlist External
    db.Account.hasMany(db.Classlist, { foreignKey: 'id' });
    db.Classlist.belongsTo(db.Account, { foreignKey: 'teacherid' , as: 'TeacherInfo' }); 

    // Sync again to apply the relationships kani kuhaon na ug mana ang system
    // await sequelize.sync({ alter: true }); 
  
    await sequelize.sync(); 
    await initializeData(db);    
}


 //db relationships
function addRelationships() {
  
    //   db.Account.hasMany(db.Studentlist, { foreignKey: 'studentid', as: 'studentinfo' });
    //   db.Studentlist.belongsTo(db.Account, { foreignKey: 'studentid', as: 'studentinfo' });
      
  
      db.Studentlist.hasMany(db.Scorelist, { foreignKey: 'studentgradeid' });
      db.Scorelist.belongsTo(db.Studentlist, { foreignKey: 'studentgradeid' });
  
      
      db.Gradelist.hasMany(db.Scorelist, { foreignKey: 'gradeid' });
      db.Scorelist.belongsTo(db.Gradelist, { foreignKey: 'gradeid'});
      
  
      db.ComputedGradelist.belongsTo(db.Studentlist, { foreignKey: 'studentgradeid' });
      db.Studentlist.hasMany(db.ComputedGradelist, { foreignKey: 'studentgradeid' });

      db.Studentlist.belongsTo(db.Classlist, { foreignKey: 'classid' });
      db.Classlist.hasMany(db.Studentlist, { foreignKey: 'classid' });
}