const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Budget extends Model {
    static associate(models) {
      Budget.belongsTo(models.User, { foreignKey: 'user_id' });
      Budget.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }

  Budget.init({
    budget_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false 
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Budget',
    tableName: 'Budgets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Budget;
};