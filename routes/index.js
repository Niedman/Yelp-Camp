var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");
var passport = require("passport");

var adminKey = process.env.ADMIN_CODE;

router.get("/",function(req,res){
   res.render("landing");
});


//register route
router.get("/register",function(req, res) {
   res.render("register", {page: 'register'}); 
});

//register handler
router.post("/register",function(req, res) {
    var newUser = new User(
        {
            username: req.body.username, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar
        });
    
    if (req.body.adminCode === adminKey){
        newUser.isAdmin = 'true';
    }
    User.register(newUser,req.body.password, function(err,user){
       if (err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       
       passport.authenticate("local")(req,res,function(){
           req.flash("success", "Welcome to YelpCamp: " + user.username);
           res.redirect("/campgrounds");
       })
   });
});


//LOGIN ROUTE
router.get("/login",function(req, res) {
   res.render("login",{page: 'login'}); 
});

//LOGIN HANDLER
router.post("/login", passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }) ,function(req, res) {
        //no need to do nothign here
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
})


//Users public profie
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
       if (err){
           req.flash("error", "User might not exist");
           res.redirect("/");
       }
       Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
           if (err){
               req.flash("error", "Something went wrong!");
               res.redirect("/");
           }
           res.render("users/show", {user: foundUser, campgrounds: campgrounds});
       })
    });
})


module.exports = router;