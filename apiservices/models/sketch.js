'use strict';
module.exports = (sequelize, DataTypes) => {
  const sketch = sequelize.define('sketch', {
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    isFavorite: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  },
 
  {});
  sketch.associate = function(models) {
    sketch.belongsTo(models.user,{
      foreignKey: 'created_by'
    }),
    sketch.hasMany(models.chapter,{
      foreignKey: 'sketch_id',
      as: 'chapterId'
    })
    
  };
  return sketch;
};