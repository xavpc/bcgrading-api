const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

     // Assign Sequelize instance to the db object
     db.sequelize = sequelize;
     db.Sequelize = Sequelize;

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


    //db relationships

    
    db.Yearlist.belongsTo(db.Classlist, { foreignKey: 'year'});
    db.Classlist.hasMany(db.Yearlist, { foreignKey: 'year' });


    db.Semesterlist.belongsTo(db.Classlist, { foreignKey: 'semester'});
    db.Classlist.hasMany(db.Semesterlist, { foreignKey: 'semester'});

    db.Classlist.hasOne(db.Subjectlist, { foreignKey: 'subjectcode'});
    db.Subjectlist.belongsTo(db.Classlist, { foreignKey: 'subjectcode'});
    

   


    // sync all models with database
    await sequelize.sync();

    // await sequelize.sync({ alter: true });
}