const express = require('express');

const {
  //checkID,
  getMe,
  getUsers,
  createUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
  updateCurrentUser,
  deleteCurrentUser,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/user-controller');
const {
  protect,
  restrictTo,
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/auth-controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updatePassword', updatePassword);
router.get('/me', getMe, getUserByID);
router.patch(
  '/updateCurrentUser',
  uploadUserPhoto,
  resizeUserPhoto,
  updateCurrentUser
);
router.delete('/deleteCurrentUser', deleteCurrentUser);
router.get('/logout', logout);

//router.param('id', checkID);

router.use(restrictTo('admin'));

router.route('/').get(getUsers).post(createUser);
router
  .route('/:id')
  .get(getUserByID)
  .patch(updateUserByID)
  .delete(deleteUserByID);

module.exports = router;
