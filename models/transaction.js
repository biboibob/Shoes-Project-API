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
      id_product: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "stock",
    }
  );

  transaction.associate = function (models) {
    transaction.belongsToMany(models.user, {
      foreignKey: "id",
      through: "id",
      // targetKey: "id_shoes",
      as: "user",
    });

    transaction.belongsToMany(models.product, {
      foreignKey: "id_product",
      through: "id_product",
      // targetKey: "id_shoes",
      as: "product",
    });

    transaction.belongsToMany(models.transaction_detail, {
      foreignKey: "id_transaction",
      through: "id_transaction",
      as: "transaction_detail_parent",
    });

    transaction.belongsToMany(models.transaction_progress, {
      foreignKey: "id_transaction",
      through: "id_transaction",
      as: "transaction_progress_parent",
    });
  };

  return transaction;
};
