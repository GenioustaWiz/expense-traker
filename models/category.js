const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.User, { foreignKey: 'user_id' });
      Category.hasMany(models.Expense, { foreignKey: 'category_id' });
      Category.hasMany(models.Budget, { foreignKey: 'category_id' });
    }
  }

  Category.init({
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Category;
};