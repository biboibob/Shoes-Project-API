// const bcrypt = require('bcrypt');
// const saltRounds = 10;

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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      //this representate which tabel on database
      tableName: "user",
    }
  );

  // user.beforeCreate((user, options) => {
  //   return bcrypt
  //     .hash(user.password, saltRounds)
  //     .then((hash) => {
  //       user.password = hash;
  //     })
  //     .catch((err) => {
  //       throw new Error();
  //     });
  // });

  return user;
};
