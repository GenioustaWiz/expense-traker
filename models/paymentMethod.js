const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  PaymentMethod.init({
    payment_method_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_method_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PaymentMethod',
    tableName: 'Payment_Methods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PaymentMethod;
};