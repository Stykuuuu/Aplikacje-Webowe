const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'books.db',
    logging: false
});

const Book = db.define('Book', {
    title:  { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    year:   { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = { db, Book };
