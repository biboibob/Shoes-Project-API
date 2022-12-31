module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
    "product",
    {
      id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_sale: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_shoes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "product",
    }
  );

  product.associate = function (models) {
    // product.hasMany(models.stock, {
    //   as: "stock",
    //   foreignKey: "id_shoes",
    //   sourceKey: "id_shoes",
    // });

    product.hasOne(models.sales, {
      as: "sales",
      foreignKey: "id_sale",
      sourceKey: "id_sale",
    });

    product.hasOne(models.category, {
      as: "category",
      foreignKey: "id_category",
      sourceKey: "id_category",
    });
    
    product.hasOne(models.shoes, {
      as: "shoes",
      foreignKey: "id_shoes",
      sourceKey: "id_shoes",
    });
  };

  // shoes.hasMany(stockModel, { as: "stocks", foreignKey: "id_shoes" });

  return product;
};
