'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorite = sequelize.define('favorite', {
    sketch_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  favorite.associate = function(models) {
    favorite.belongsTo(models.user,{
      foreignKey: 'user_id'
    }),
    favorite.belongsTo(models.sketch,{
      foreignKey: 'sketch_id',
      as: 'sketchId'
    })
  };
  return favorite;
};