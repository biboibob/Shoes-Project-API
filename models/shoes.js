module.exports = (sequelize, DataTypes) => {
  const shoes = sequelize.define(
    "shoes",
    {
      id_shoes: {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      release_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "shoes",
    }
  );

  shoes.associate = function (models) {
    shoes.hasMany(models.stock, {
      as: "stock",
      foreignKey: "id_shoes",
      sourceKey: "id_shoes",
    });

    shoes.hasOne(models.sales, {
      as: "sales",
      foreignKey: "id_sale",
      sourceKey: "id_sale",
    });

    shoes.hasOne(models.category, {
      as: "category",
      foreignKey: "id_category",
      sourceKey: "id_category",
    });
  };

  // shoes.hasMany(stockModel, { as: "stocks", foreignKey: "id_shoes" });

  return shoes;
};
