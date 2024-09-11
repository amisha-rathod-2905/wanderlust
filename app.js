if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
    console.log(process.env);
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const connect_mongo = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// routers
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js"); 
const searchRoute = require('./routes/search.js');
const MongoStore = require('connect-mongo');

DB_url = process.env.ATLAS_URL;

main().then(()=>{
    console.log("connected to DB");
    }).catch((e) => {
        console.log(e);
    });
    
    async function main(){
        // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

      await  mongoose.connect(DB_url);
    }
   

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl : DB_url,
    crypto: {
        secret: process.env.SECRET,
    }, 
    touchAfter: 24 * 3600, // for lazy updates
});

store.on("error", () => {
    console.log("ERROR in session store", err);
});

const sessionOptions = {
    store: store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        MaxAge : 7* 24*60*60*1000,
        httpOnly : true,
    },
};


// app.get("/", (req, res) => {
//     res.send("root is working...");
//  });


// middleware for session & flash
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
next();
});


// listing router
app.use("/listing", listings);
// review router
app.use("/listing/:id/reviews", reviews);
// user router
app.use("/",users);
//search router
app.use('/api', searchRoute);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Middileware
app.use((err, req, res, next) => {
    let { statuscode=500, message="something went wrong!"} = err;
   res.render("listing/error.ejs", {message , statuscode});
});

app.listen(3000, () => {
    console.log("app is listening on port 3000");
});


