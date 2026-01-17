const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'orders.db',
    logging: false
});

const Order = db.define('Order', {
    userId:   { type: DataTypes.INTEGER, allowNull: false },
    bookId:   { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

module.exports = { db, Order };
