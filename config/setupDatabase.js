const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

async function checkAndCreateSchema() {
  const connection = await mysql.createConnection(config);

  try {
    // Check if the database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME]);

    if (databases.length === 0) {
      // Database does not exist, create it
      const schemaSQL = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
      await connection.query(schemaSQL);
      console.log(`Database ${process.env.DB_NAME} created and schema applied.`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
  } catch (error) {
    console.error('Error checking or creating the database schema:', error);
  } finally {
    await connection.end();
  }
}

checkAndCreateSchema();
