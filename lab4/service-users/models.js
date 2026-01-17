const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'users.db',
    logging: false,           // na czas debug: console.log
});

const User = db.define('User', {
    email:    { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'users',       // jawna nazwa tabeli (bez niespodzianek)
    timestamps: false,
});

module.exports = { db, User };
