const authController = require('../controllers/authController')
const router = require("express").Router();
const passport = require("passport");
const cors = require("cors")

// path /users
router.get('/', authController.getUser);
router.post('/login', authController.login);
//  {failureRedirect: '/register', successRedirect:'/quiiiiiz'}
//
router.post('/register', authController.register);
router.get('/logout', authController.logout);


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {    //a passport function
      return next()
    }
    res.status(401).send(); // unauthorized error
  }

module.exports = router;
