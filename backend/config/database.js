const { model } = require('mongoose');
const Sequelize = require('sequelize');


const sequelize = new Sequelize('chatapp', 'root', 'Kalake@13', {
  dialect: 'mysql',
  host: 'localhost',
});



module.exports = sequelize;