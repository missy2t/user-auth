const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this points to your Sequelize instance

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // Check if this is the correct model name in your database
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    material_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Materials',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    tx_ref: {
        type: DataTypes.STRING, // Allows storing alphanumeric transaction references
        allowNull: false,
        unique: true // Ensures no duplicate transaction references
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false, // Disabling automatic timestamps, since 'created_at' is manually defined
    tableName: 'payments'
});

module.exports = Payment;
