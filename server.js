var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	passport = require('passport'),
	cookieParser = require("cookie-parser"),
	flash        = require("connect-flash"),
	session = require("express-session"),
	Cryptocurrency = require("./models/cryptocurrency"),
	User = require("./models/user"),
	LocalStrategy = require("passport-local");


// BEGIN WITH SETUP
var port = process.env.PORT || 3000;
mongoose.connect('mongodb://127.0.0.1:27017/crypto_forum');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('secret'));
app.use(methodOverride('_method'));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love donuts",
    resave: false,
    saveUninitialized: false
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DONE WITH SETUP

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

// SETUP ROUTES
var indexRoutes = require('./routes/index'),
	cryptocurrencyRoutes = require("./routes/cryptoforum"),
	commentRoutes = require("./routes/comment");

app.use('/', indexRoutes);
app.use('/cryptocurrency', cryptocurrencyRoutes);
app.use('/cryptocurrency/:id/comments', cryptocurrencyRoutes);
// DONE WITH SETUP ROUTES

app.listen(port, function() {
	console.log("server is running");
});
