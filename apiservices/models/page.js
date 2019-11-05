'use strict';
module.exports = (sequelize, DataTypes) => {
  const page = sequelize.define('page', {
    image: DataTypes.STRING,
    sketch_id: DataTypes.INTEGER,
    chapter_id: DataTypes.INTEGER
  }, 
 
  {});
  page.associate = function(models) {
    page.belongsTo(models.chapter,{
      foreignKey:'chapter_id',
      as: 'chapterId'
    }),
    page.belongsTo(models.sketch,{
      foreignKey: 'sketch_id',
      as: 'sketchId'
    })
  };
  return page;
};