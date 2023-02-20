module.exports = (sequelize, DataTypes) => {
  const transaction_detail = sequelize.define(
    "transaction_detail",
    {
      id_transaction_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      id_transaction: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receipt_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      purchased_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "transaction_detail",
    }
  );

  transaction_detail.associate = function (models) {
    transaction_detail.hasOne(models.transaction, {
      foreignKey: "id_transaction",
      sourceKey: "id_transaction",
      as: "transaction_detail",
    });
  };

  return transaction_detail;
};
