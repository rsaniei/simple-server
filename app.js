const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo");
const dotenv = require('dotenv');
const session = require('express-session');//gives access to request.session object
const passport = require('passport');
const authRouter = require('./routes/authRouter');
const errorHandler = require('./middleware/errorHandler')
const initializePassport = require('./config/passport-config')
const cors = require('cors')
const app = express();
const MONGO_BD = "mongodb+srv://vercel-admin-user:2VhunSBXehwF2TAw@cluster0.rch8ndm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// ********* CORS SETUP *************
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    );
    next();
  });

  app.use(
    cors({
      credentials: true,
      allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept"],
    })
  );
  app.set("trust proxy", 1);
  ///
initializePassport(passport);
dotenv.config();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("build"));
// }
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/', express.static('./public'));
mongoose.set('strictQuery', true);
const port = process.env.PORT || 4000;
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGODB_URI,
  collection: "sessions",
});

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "process.env.SECRET",
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,

  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res)=>{
  res.send("Hello Hello!")
})
app.use('/users', authRouter);
app.use(errorHandler);
app.listen(port, "0.0.0.0", (err) =>{
            if(err) console.log("Server could not be started" + err);
            else console.log(`Server listening at port ${port}...."`)
        })

// mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true})
//     .then(() => {
//         console.log('Database connection successful')
//         app.listen(port, "0.0.0.0", (err) =>{
//             if(err) console.log("Server could not be started" + err);
//             else console.log(`Server listening at port ${port}...."`)
//         })
//     })
//     .catch(err => {
//         console.error('Database connection error');
//         console.log(err);
//     });
