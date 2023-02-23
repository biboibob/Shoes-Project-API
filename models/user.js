var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiver: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      detail_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address_note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      province_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      //this representate which tabel on database
      tableName: "user",
    }
  );

  user.beforeCreate((user, options) => {
    return bcrypt
      .hash(user.password, saltRounds)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => {
        throw new Error();
      });
  });

  user.associate = function (models) {
    user.hasMany(models.transaction, {
      foreignKey: "id",
      sourceKey: "id",
      as: "user_transaction",
    });
  };

  return user;
};
