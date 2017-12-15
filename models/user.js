module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: "compositeIndex"
    },
    pin: DataTypes.INTEGER(4)
  });
  return User;
};
