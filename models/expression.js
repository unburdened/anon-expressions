module.exports = function(sequelize, DataTypes) {
  var Expression = sequelize.define("Expression", {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    message: DataTypes.STRING,
    lat: DataTypes.DECIMAL(9, 6),
    lng: DataTypes.DECIMAL(9, 6)
  });

  Expression.associate = function(models) {
    // We're saying that an Expression should belong to an User
    // An Expression can't be created without a User due to the foreign key constraint
    Expression.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Expression;
};
