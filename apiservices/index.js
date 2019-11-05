require('express-group-routes');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const port = Number(process.env.PORT || 5001);

//multer
const Storage = multer.diskStorage({
  destination(req, file, callback) {
    console.log(__dirname);
    callback(null, './images/');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({storage: Storage});

app.use(bodyParser.json());
app.use('/images', express.static('images'));

//import controllers
const SketchController = require('./controllers/sketches');
const AuthController = require('./controllers/auth');

//middleware
const {authenticated} = require('./middleware');

app.group('/api/v1', router => {
  router.post('/register', AuthController.register);
  router.post('/login', AuthController.login);
  router.get('/user/:id', authenticated, AuthController.show);
  router.put(
    '/user/:id',
    upload.single('photo'),
    authenticated,
    AuthController.update,
  );

  router.get('/sketches', SketchController.index);
  // router.get('/sketches/favorites', authenticated, SketchController.favoriteIndex)

  router.get('/user/:id/favorites', authenticated, SketchController.favIndex);
  router.post('/user/:id/favorite', authenticated, SketchController.FavStore);
  router.delete(
    '/user/:id/favorite',
    authenticated,
    SketchController.FavDestroy,
  );

  router.get('/sketch/:skId/chapters', SketchController.show);
  router.get('/sketch/:skId/chapter/:chId', SketchController.chapterShow);

  router.get('/user/:id/sketches', authenticated, SketchController.userIndex);
  router.post(
    '/user/:id/sketch',
    upload.single('photo'),
    authenticated,
    SketchController.userStore,
  );
  router.get(
    '/user/:id/sketch/:skId/chapters',
    authenticated,
    SketchController.userShow,
  );
  router.put(
    '/user/:id/sketch/:skId',
    upload.single('photo'),
    authenticated,
    SketchController.userUpdate,
  );
  router.delete(
    '/user/:id/sketch/:skId',
    authenticated,
    SketchController.userDestroy,
  );

  router.post(
    '/user/:id/sketch/:skId/chapter',
    upload.single('photo'),
    authenticated,
    SketchController.chapterStore,
  );
  router.put(
    '/user/:id/sketch/:skId/chapter/:chId',
    upload.single('photo'),
    authenticated,
    SketchController.chapterUpdate,
  );
  router.delete(
    '/user/:id/sketch/:skId/chapter/:chId',
    authenticated,
    SketchController.chapterDestroy,
  );

  router.get(
    '/user/:id/sketch/:skId/chapter/:chId',
    authenticated,
    SketchController.imageIndex,
  );
  router.post(
    '/user/:id/sketch/:skId/chapter/:chId/image',
    upload.single('photo'),
    SketchController.imageStore,
  );
  router.delete(
    '/user/:id/sketch/:skId/chapter/:chId/image/:pgId',
    authenticated,
    SketchController.imageDestroy,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
