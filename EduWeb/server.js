// import packages
import express from "express";
import morgan from "morgan";
import session from 'express-session';
import passport from "passport";
// import upload from 'express-fileupload';
import path from 'path';

const __dirname = path.resolve();


// passport config
import localStartegy from "./middlewares/passportValidation/passportLocal.js";
localStartegy(passport);

// connecting to databse
import "./database/mongodb.js";


// importing routing file
import userRoute from "./routes/user.route.js";
import homeRoute from "./routes/home.route.js";
import adminRoute from "./routes/admin.route.js";
import googleRoute from "./routes/google.route.js";

// init
const app = express();


// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// passport
app.use(passport.initialize());
app.use(passport.session());

// setting file uploader
// app.use(upload({
//     useTempFiles: true
// }));


// view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');


// routing
app.use('/users', userRoute);
app.use('/admins', adminRoute);
app.use('/google', googleRoute);
app.use('/', homeRoute);


// 404 error
app.use((req, res, next) => {
    next(new Error("Path is not defined"));
});


// error handler
app.use((err, req, res, next) => {
    console.log(err);
    // if(err === 'not image') return res.redirect('/upload?noImage=true')
    res.status(404).json({
        data: [],
        mesage: 'error ocuured',
        error: {message: err.message}
    });
});


// listening
app.listen(3000, console.log("server is runnning...")); 
