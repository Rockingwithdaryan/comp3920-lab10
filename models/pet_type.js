const { Sequelize } = require('sequelize');
const sequelize = include('/databaseConnectionSequelize');

const petTypeModel = sequelize.define('pet_type',
    {
        pet_type_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        type:        { type: Sequelize.STRING,  allowNull: false, unique: true }
    },
    {
        tableName:  'pet_type',
        timestamps: false,
        singular:   'pet_type',
        plural:     'pet_type'
    }
);

module.exports = petTypeModel;