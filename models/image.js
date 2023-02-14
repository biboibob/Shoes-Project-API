module.exports = (sequelize, DataTypes) => {
    const image = sequelize.define(
      "image",
      {
        id_image: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        id_shoes: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        URL: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
  
      {
        timestamps: false,
  
        //this representate which tabel on database
        tableName: "image",
      }
    );
  
    image.associate = function (models) {
        image.hasOne(models.shoes, {
        foreignKey: "id_shoes",
        sourceKey: "id_shoes",
        // targetKey: "id_shoes",
        as: "shoes",
      });
    };
  
    return image;
  };
  