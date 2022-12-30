module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define(
    "category",
    {
      id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },

    {
      timestamps: false,

      //this representate which tabel on database
      tableName: "category",
    }
  );

  category.associate = function (models) {
    category.hasMany(models.shoes, {
      as: "shoes",
      foreignKey: "id_category",
      sourceKey: "id_category",
    });
  };

  // shoes.hasMany(stockModel, { as: "stocks", foreignKey: "id_shoes" });

  return category;
};
