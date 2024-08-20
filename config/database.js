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
//     process.env.DB_NAME, 
//     process.env.DB_USER, 
//     process.env.DB_PASSWORD, 
//     {
//   host: process.env.DB_HOST,
//   dialect: process.env.DIALECT,
//   logging: false
// });

// module.exports = sequelize;