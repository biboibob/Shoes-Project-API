module.exports = (sequelize, DataTypes) => {
    const transaction_progress = sequelize.define(
      "transaction_progress",
      {
        id_progress: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
  
        id_transaction: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        progress_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        progress_description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        }
      },
  
      {
        timestamps: false,
  
        //this representate which tabel on database
        tableName: "transaction_progress",
      }
    );
  
    transaction_progress.associate = function (models) {
        transaction_progress.belongsTo(models.transaction, {
        foreignKey: "id_transaction",
        sourceKey: "id_transaction",
        as: "transaction_progress",
      });
    };
  
    return transaction_progress;
  };
  