const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database'); // Ensure this points to your Sequelize instance
const authRoutes = require('../routes/authRoutes');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 30]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Email address must be unique'
        },
        validate: {
            isEmail: {
                msg: 'Please provide a valid email address'
            },
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 100]
        }
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'admin']]
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: true,
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    hooks: {
        beforeValidate: (user) => {
            if (user.email) {
                user.email = user.email.trim().toLowerCase();
            }
        },
        beforeCreate: async (user) => {
            if (user.password) {
                console.log('Hashing password during registration:', user.password); // Debug log
                user.password = await bcrypt.hash(user.password, 10);
                console.log('Hashed password:', user.password); // Debug log
            }
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                console.log('Hashing password during update:', user.password); // Debug log
                user.password = await bcrypt.hash(user.password, 10);
                console.log('Hashed password:', user.password); // Debug log
            }
        }
    }
});

User.associate = (models) => {
  User.hasMany(models.Notification, { foreignKey: 'user_id' });
};

User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = User;
