const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/database.js');
const db = {};

// Call the setupDatabase script bfr runnig the other proccesses
// require('../config/setupDatabase');

let sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(file => {
    // Reads all files in the current directory (__dirname).
    // Filters out the current file (index.js) and any non-JavaScript files.
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // aquires each model file and initializes it with the Sequelize instance and DataTypes.
    // Stores the initialized model in the db object using the model's name as the key.
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  // Iterates through all models in the db object.
  // If a model has an associate method (used to set up relationships), it calls this method with the db object to establish associations between models.
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Adds the Sequelize instance and Sequelize constructor to the db object.
// Exports the db object so that it can be used elsewhere in the application, providing access to all models and the Sequelize instance.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;