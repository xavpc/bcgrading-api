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
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

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
    db.Yearlist = require('../-models/year.model.js')(sequelize);
    
    db.Semesterlist = require('../-models/semester.model.js')(sequelize);

    db.Subjectlist = require('../-models/subjects.model.js')(sequelize);

    db.Classlist = require('../-models/classlist.model.js')(sequelize);

    db.Gradelist = require('../-grades/grade.model.js')(sequelize);

    db.Attendancescores = require('../_scores/attendance.model.js')(sequelize);

    db.Participationscores = require('../_scores/participation.model.js')(sequelize);
   
    db.Quizscores = require('../_scores/quiz.model.js')(sequelize);
   
    db.ActivityProjectscores = require('../_scores/activityprojectyawa.model.js')(sequelize);

    db.ExamScores = require('../_scores/exam.model.js')(sequelize);
  




    // sync all models with database first para di mag error     // await sequelize.sync();
    await db.Account.sync({ alter: true }); // Sync Accounts first
    await db.Yearlist.sync({ alter: true });
    await db.Semesterlist.sync({ alter: true });
    await db.Subjectlist.sync({ alter: true });
    await db.Classlist.sync({ alter: true });
    await db.Attendancescores.sync({ alter: true }); // Sync Attendancescores before Gradelist
    await db.Participationscores.sync({ alter: true }); // Sync Participationscores before Gradelist
    await db.Quizscores.sync({ alter: true }); // Sync Quizscores before Gradelist
    await db.ActivityProjectscores.sync({ alter: true }); // Sync ActivityProjectscores before Gradelist
    await db.ExamScores.sync({ alter: true }); // Sync ExamScores before Gradelist
    await db.Gradelist.sync({ alter: true }); // Sync Gradelist last

  

    // Now add the relationships
    addRelationships();

    // Sync again to apply the relationships kani kuhaon na ug mana ang system
    await sequelize.sync({ alter: true });


    // await sequelize.sync(); //kani na gamiton kung mana system yaa

    await initializeData(db);    //i comment out ni after doy kung mana kag npm start kausa

}


 //db relationships
function addRelationships() {
    // Define relationships between models
    db.Yearlist.belongsTo(db.Classlist, { foreignKey: 'year' });
    db.Classlist.hasMany(db.Yearlist, { foreignKey: 'year' });

    db.Semesterlist.belongsTo(db.Classlist, { foreignKey: 'semester' });
    db.Classlist.hasMany(db.Semesterlist, { foreignKey: 'semester' });

    db.Classlist.hasOne(db.Subjectlist, { foreignKey: 'subjectcode' });
    db.Subjectlist.belongsTo(db.Classlist, { foreignKey: 'subjectcode' }); 

    db.Account.hasMany(db.Gradelist, { foreignKey: 'studentid' });
    db.Gradelist.belongsTo(db.Account, { foreignKey: 'studentid' });
    

    // db.Classlist.hasMany(db.Gradelist, { foreignKey: 'classid' });
    // db.Gradelist.belongsTo(db.Classlist, { foreignKey: 'classid' });



    // db.Classlist.hasMany(db.Attendancescores, { foreignKey: 'classid' });
    // db.Attendancescores.belongsTo(db.Classlist, { foreignKey: 'classid' });

    db.Attendancescores.hasOne(db.Gradelist, { foreignKey: 'attendanceid' });
    db.Gradelist.belongsTo(db.Attendancescores, { foreignKey: 'attendanceid' });

    db.Participationscores.hasOne(db.Gradelist, { foreignKey: 'participationid' });
    db.Gradelist.belongsTo(db.Participationscores, { foreignKey: 'participationid' });

    db.Quizscores.hasOne(db.Gradelist, { foreignKey: 'quizid' });
    db.Gradelist.belongsTo(db.Quizscores, { foreignKey: 'quizid' });

    db.ActivityProjectscores.hasOne(db.Gradelist, { foreignKey: 'activityprojectid' });
    db.Gradelist.belongsTo(db.ActivityProjectscores, { foreignKey: 'activityprojectid' });

    db.ExamScores.hasOne(db.Gradelist, { foreignKey: 'examid' });
    db.Gradelist.belongsTo(db.ExamScores, { foreignKey: 'examid' });

    


}