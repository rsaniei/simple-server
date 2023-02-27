// const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require("passport");
const {BadRequest} = require('../utils/errors')

function logout(req, res, next) {
  req.logout() //delete the request.session.passport property from the session
  res.clearCookie("connect.sid", { path: "/" });

  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({message:"logged out!"});
  });
}


function login(req, res, next) {
  passport.authenticate("local", function (err, user, info) {

    if (err || !user) {

      next(err)
      console.log("passport authenticate says", info.message)
      throw new BadRequest("Missing required field: password, or email")
      // res.status(401).send({message: "Missing required field: email or password"});
    } else {

      console.log("user found")
      // if user authenticated, maintain in the session
      //Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
      //When the login operation completes, user will be assigned to req.user
      //Note: passport.authenticate() middleware invokes req.login() automatically.
      //https://github.com/jaredhanson/passport/blob/master/lib/http/request.js
      req.login(user, function (err) {

        if (err) {
          return next(err);
        }
        res.status(200).json({
          email: user.email,
          name: user.name,
        });
      });
    }
  })(req, res, next);

}

  async function register(req, res, next) {
    console.log("in the register module");
    const {name, email, password} = req.body;
    try{
    if(!name || !email || !password){
      console.log("here in register ");
      // res.status(400).json({message:"Missing required field: name, password, or email"});
     throw new BadRequest("Missing required field: name, password, or email");
    //  next(error)
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new BadRequest("Email is taken. Plaese use another email address.");
      // return res.status(400).send({message:`Email already taken. Plaese use another email address.`});
    }

    else {

    const hashedPassword = req.body.password;

      const newuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      //Auto-login after registering
          req.login(newuser, function (err) {

            if (err) {
              next(err);
            }
            res.status(200).json({
              email: newuser.email,
              name: newuser.name,
            });
          });
	}
    }
  catch(error) {
      console.log(error)
      next(error);
    }
  };


  async function getUser(req, res) {

    await User.create({
        name: "ali shadman",
        email: "ali@gmail.com",
        password: "123"
      });
    // const user = await User.find({""});
    // res.status(200).json(user

    // 	// email: req.user.email,
    //   // name: req.user.name
  	// );
    // res.send("Hello from backend!!!")
  };



  module.exports = {getUser, login, logout, register};
