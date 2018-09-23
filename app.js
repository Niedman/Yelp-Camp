require('dotenv').config();

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    metohOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")
    
//Requiring ROUTES    
var commentRoutes       = require("./routes/comments"),
    campgroundsRoutes   = require("./routes/campgrounds"),
    authRoutes          = require("./routes/index")
    

//Seed the DB
//seedDB();
var dbuser = process.env.DB_USER;
var dbpassword = process.env.DB_PASS;


//mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });
mongoose.connect("mongodb://dbuser:dbpassword@ds113003.mlab.com:13003/niedmanyelpcamp",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(metohOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "Once again Rusty wins the cutest dog!#",
   resave: false,
   saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//session user
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


//This shorts the routes inside each route(campgrouds, comments)
//USE routes
app.use("/", authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT,process.env.IP, function(){
   console.log("Server is running..."); 
});