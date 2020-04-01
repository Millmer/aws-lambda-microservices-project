const Sequelize = require('sequelize');
const { errorResponse, successResponse } = require('../responses');

const mysql2 = require('mysql2');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    dialectModule: mysql2,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
);

const Models = require('./../../models')(sequelize);

// Create relationships in the ORM if associate exists
Object.values(Models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(Models));

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.debug('=> Using existing connection.')
    return Models
  }

  await sequelize.sync()
  await sequelize.authenticate()
  isConnected = true
  console.debug('=> Created a new connection.')
  return Models
}

async function healthCheck() {
  try {
    await connectToDatabase();
    console.debug('Connection successful.');
    return successResponse(200, {message: 'Connection successful.' });
  } catch(e) {
    console.error(e);
    return errorResponse(e, "Could not connect.");
  }
}

module.exports = { connectToDatabase, healthCheck, sequelize }