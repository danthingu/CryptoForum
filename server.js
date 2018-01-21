var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	passport = require('passport'),
	LocalStrategy = require("passport-local");

var port = process.env.PORT || 3000;

var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://locahost/crypto_forum", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

app.use("/", indexRoutes);

app.listen(port, function() {
	console.log("server is running");
});
