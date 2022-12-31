module.exports = (sequelize, DataTypes) => {
  const sales = sequelize.define(
    "sales",
    {
      id_sale: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sale_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "sale",
    }
  );

  sales.associate = function (models) {
    sales.hasMany(models.product, {
      as: "product",
      foreignKey: "id_sale",
      sourceKey: "id_sale",
    });
  };

  // shoes.hasMany(stockModel, { as: "stocks", foreignKey: "id_shoes" });

  return sales;
};
