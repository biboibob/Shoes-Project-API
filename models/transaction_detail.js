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
      id_product: {
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
      price: {
        type: DataTypes.DOUBLE,
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
    models.transaction.belongsToMany(models.product, {
      through: "fk_transaction_product",
      sourceKey: "id_transaction",
      targetKey: "id_product",
    });
    
  };

  return transaction_detail;
};
