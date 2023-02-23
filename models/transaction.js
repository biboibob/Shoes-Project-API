module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    "transaction",
    {
      id_transaction: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receipt_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      purchased_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_discount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      shipping_cost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "transaction",
    }
  );

  transaction.associate = function (models) {
    transaction.hasMany(models.transaction_detail, {
      as: "transaction_detail_parent",
      foreignKey: "id_transaction",
      sourceKey: "id_transaction",
    });

    transaction.hasMany(models.transaction_progress, {
      as: "transaction_progress_parent",
      foreignKey: "id_transaction",
      sourceKey: "id_transaction",
    });

    transaction.hasMany(models.user, {
      as: "transaction_id_user",
      foreignKey: "id",
      sourceKey: "id",
    });

    // https://sequelize.org/docs/v6/core-concepts/assocs/
  };

  return transaction;
};
