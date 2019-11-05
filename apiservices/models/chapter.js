'use strict';
module.exports = (sequelize, DataTypes) => {
  const chapter = sequelize.define('chapter', {
    chapter_title: DataTypes.STRING,
    image: DataTypes.STRING,
    sketch_id: DataTypes.INTEGER
  }, 
  
  {});
  chapter.associate = function(models) {
    chapter.belongsTo(models.sketch,{
      foreignKey: 'sketch_id',
      as: 'sketchId'
    })
  };
  return chapter;
};