// const { Sequelize } = require('sequelize');
require('dotenv').config();

module.exports = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT
  };

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
//   }
// );

// (async () =>{ 
//   try{
//     await sequelize.authenticate();
//     console.log("Database Connection Successful");

//     // Sync defined models to the database
//     await sequelize.sync({ alter: true}); //this will create tables if they 
//     //dont exist or update the existing outlineStyle: 

//   }catch (error){
//     console.error("Unable to connect to the database", error);
//   }

// })();
// module.exports = sequelize;