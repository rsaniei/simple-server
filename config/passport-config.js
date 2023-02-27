const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')
const User = require('../models/user')
function initialize(passport){

  //3.function that localstrategy uses to authenticate user
  const authenticatieUser = async (email, password, done)=>{
    console.log("called authenticate User", email, password)
    const user = await User.findOne({email: email});

    if (user == null) {
      return done(null, false, { message: 'Incorrect email or password' })
    }

    try {
      if (password === user.password) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect email or password' })
      }
    } catch (e) {
      return done(e)
    }

  }
//2
  passport.use(new LocalStrategy({usernameField: 'email'}, authenticatieUser))

  passport.serializeUser((user, done)=>{
    // put the user id into the session
    // serialize user to store in the session
    //  console.log(`serializing user ${user}`)
    return done(null, user.id)
  })

  passport.deserializeUser(async (id, done)=>{
    //get the id and extract the user infor from db
    const user = await User.findOne({_id: id});
    // console.log(`deserializing user ${user}`)
    return done(null, user)
  })
}
module.exports = initialize;
