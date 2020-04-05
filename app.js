const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require("passport"),
	localStrategy = require("passport-local"),
  	passportLocalMongoose = require("passport-local-mongoose"),
  	expressSession = require("express-session"),
  	user = require("./models/user");

mongoose.connect("mongodb://localhost:27017/tnd", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
  secret: "TND => Truth and Dare",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//===================== ROUTES ========================

app.get("/", function(req, res) {
  console.log("get request to '/'");
  res.render("home");
});
//SHOW LOGIN PAGE
app.get("/user/login", function(req, res) {
  res.render("login");
});
//HANDLE LOGIN
app.post("/user/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/user/login"
  }), function(req, res) {
});
//HANDLE LOGOUT
app.get("/user/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
//SHOW SIGNUP PAGE
app.get("/user/signup", function(req, res) {
  res.render("signup");
});
//HANDLE NEW SIGNUP
app.post("/user/signup", function(req, res) {
  //TAKES PASSWORD OF GIVEN USERNAME AND HASHES IT
  user.register(new user({
    username: req.body.username
  }), req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      return res.render("/user/signup");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/secret");
    })
  });
});
//DUMMY PAGE TO CHECK AUTHENTICATIONS OF LOGIN/SIGNUP
app.get("/secret", isLoggedIn,  function(req, res) {
  res.render("secret");
});

//MIDDLEWARE FUNCTION FOR AUTHENTICATION
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/login");
}

//SERVER PORT
app.listen(process.env.PORT, function() {
  console.log("server started");
});
