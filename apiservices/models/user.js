'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    image: DataTypes.STRING
  },
   
  {});
  user.associate = function(models) {
    user.hasMany(models.sketch,{
      foreignKey: 'created_by',
      as : 'sketchId'
    })
  };
  return user;
};