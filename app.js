const express = require('express');
const path = require('path');
const router = require('./controller/routes');
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
const passport = require('passport');
const flash = require('connect-flash');
const app = express();

// MIDDLEWARES
// BODY-PARSER
app.use(express.urlencoded({extended : false}));
// STATIC FILES
app.use(express.static(path.join(__dirname , "public")));

// VIEWS
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , "views"));

// Session
app.use(expressSession({
    secret : "random",
    resave : true,
    saveUninitialized : false,
    maxAge : 60*1000,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
}));


// PASSPORT
// passport.initialize --> initializes the authentication module
app.use(passport.initialize());
app.use(passport.session());

// FLASH
app.use(flash());
app.use((req , res , next)=>{
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

// ROUTES
app.use("/" , router);

// LISTEN
app.listen(3000 , ()=>{
    console.log("server up and running");
});