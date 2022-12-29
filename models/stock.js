module.exports = (sequelize, DataTypes) => {
  const stock = sequelize.define(
    "stock",
    {
      id_stock: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_shoes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      stock_number: {
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
      sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "stock",
    }
  );

  stock.associate = function (models) {
    stock.hasOne(models.shoes, { foreignKey: 'id_shoes', as: "shoes" });
  };

  return stock;
};
