const multer = require('multer')
const models = require('../models')
const Sequelize = require('sequelize')
const Sketch = models.sketch
const Chapter = models.chapter
const Page = models.page
const Fav = models.favorite
const User = models.user
const Op = Sequelize.Op

const ip = `https://gentle-springs-64991.herokuapp.com/`
const upload = multer({dest : './images'})


exports.index = (req, res) => {

  if(req.query.is_favorite){
    Sketch.findAll({
      where: {isFavorite: true},
    }).then(sketches => res.send(sketches))
  } 
  else if(req.query.title){
    Sketch.findAll({
      where: {title: {[Op.like]: `%${req.query.title}%`}},
    }).then(sketches => res.send(sketches)) 
  }
  else {
    Sketch.findAll().then(sketch=>res.send(sketch))
  }
}

exports.favoriteIndex = (req, res) => {
  if (req.query.title){
    Sketch.findAll({
      where: {isFavorite: true, title: {[Op.like]: `%${req.query.title}%`}},
    }).then(sketches => res.send(sketches)) 
  } else {
    Sketch.findAll({
    where: {isFavorite: true},
  }).then(sketches => res.send(sketches))
  }
 
}

exports.favIndex = (req,res) => {
  if (req.query.title){
    Fav.findAll({
      where: {user_id : req.params.id },
      include: {
        model: Sketch,
        as: 'sketchId',
        where: { title: {[Op.like]: `%${req.query.title}%`} }
      }
    }).then(sketch=>res.send(sketch))
  } else {
    Fav.findAll({
    where: {user_id : req.params.id},
    include: {
      model: Sketch,
      as: 'sketchId'
    }
  })
  .then(sketch=>res.send(sketch))
  }
}

exports.FavStore = (req,res) => {
  Fav.create({
    user_id: JSON.parse(req.params.id),
    sketch_id: req.body.sketch_id
  }
  ).then(sketch=>{
    res.send({
    message: 'success',
    sketch
  })
})
}

exports.FavDestroy = (req,res) => {

  Fav.destroy(
    {where: {
      sketch_id: req.body.sketch_id, 
      user_id: req.params.id}
    })
    .then(sketch => {
    res.send({
      message: 'success',
    }) 
  }) 
}

exports.show = (req, res) => {
  const id = req.params.skId

  Chapter.findAll({
    where: {sketch_id: id},
    include: {
      model: Sketch,
      as: 'sketchId',
    }
  })
    .then(sketch=>res.send(sketch))

}


exports.chapterShow = (req, res) => {
  
  Page.findAll({
    where:{
      sketch_id: req.params.skId,
      chapter_id: req.params.chId
    }, 
      })
      .then(chapter=>res.send(chapter)) 
}

exports.userIndex = (req,res) => {
  const id = req.params.id
  Sketch.findAll({
    where: {created_by:id}}).then(sketch=>res.send(sketch))
}

exports.userStore = (req,res) => {

    Sketch.create({
      title: req.body.title,
      genre: req.body.genre,
      isFavorite: req.body.isFavorite,
      image: ip + req.file.path,
      created_by: req.params.id
    },
      {
        where:{
          created_by: req.params.id
        }
      }
      ).then(sketch=>{
      res.send({
      message: 'success',
      sketch
    })
  })
}

exports.userShow = (req,res) =>{

  Chapter.findAll({
    where: {sketch_id: req.params.skId},
    include: {
      model: Sketch,
      as: 'sketchId',
      where: {
        created_by: req.params.id
      }
    }
  }).then(chapter=>res.send(chapter))
}


exports.userUpdate = (req,res) => {
  const data = req.body

    Sketch.update({
      title: req.body.title,
      genre: req.body.genre,
      image: ip + req.file.path
    }, 
      {where: 
        {id: req.params.skId,
         created_by: req.params.id
      }})
        .then(sketch=>{
      res.send({
      message: 'success',
    })
  }) 
}


exports.userDestroy = (req,res) => {

    Sketch.destroy(
      {where: {
        id: req.params.skId, 
        created_by: req.params.id}})
        .then(sketch => {
    res.send({
      message: 'success',
    }) 
  }) 
}


exports.chapterStore = (req,res) => {
  const data = req.body

    Chapter.create({
      chapter_title: req.body.chapter_title,
      sketch_id: req.body.sketch_id,
      image: ip + req.file.path
    },{
      include:{
        model: Sketch,
        as: 'sketchId',
        where: {
          created_by: req.params.id,
          id: req.params.skId
        }
      }}
      ).then(chapter=>{
      res.send({
      message: 'success',
      chapter
    })
  })
}


exports.chapterUpdate = (req,res) => {
  const data = req.body

    Chapter.update({
      chapter_title: req.body.chapter_title,
      image: ip + req.file.path
    }, 
      {where: 
        {id: req.params.chId,
         sketch_id: req.params.skId
      },
      include: {
        model: Sketch,
        as: 'sketchId',
        where: {
          created_by: req.params.id
        }
      }
    }).then(sketch=>{
      res.send({
      message: 'success',
    })
  }) 
}

exports.chapterDestroy = (req,res) => {

    Chapter.destroy( 
      {where: 
        {id: req.params.chId,
         sketch_id: req.params.skId
      },
      include: {
        model: Sketch,
        as: 'sketchId',
        where: {
          created_by: req.params.id
        }
      }
    }).then(sketch=>{
      res.send({
      message: 'success',
    })
  }) 
}

exports.imageIndex = (req,res) => {

  Page.findAll({
    where: {
      chapter_id: req.params.chId,
      sketch_id: req.params.skId
    },
    include: {
      model: Sketch,
      as: 'sketchId',
      where: {
        created_by: req.params.id
      }
    }
  }).then(chapter=>res.send(chapter))
}



exports.imageStore = (req,res) => {
  const data = req.body

    Page.create({
      sketch_id: req.params.skId,
      chapter_id: req.params.chId,
      image: ip + req.file.path
    },
      {
      include: {
        model: Sketch,
        as: 'sketchId',
        where: {
          created_by: req.params.id
        }
      }
      }).then(image=>{
      res.send({
      message: 'success',
      image
    })
  })
}


exports.imageDestroy = (req,res) => {
  Page.destroy( 
    {where: 
      {id: req.params.pgId,
       chapter_id: req.params.chId,
       sketch_id: req.params.skId
    },
    include: {
      model: Sketch,
      as: 'sketchId',
      where: {
        created_by: req.params.id
      }
    }
  }).then(sketch=>{
    res.send({
    message: 'success',
  })
}) 
}