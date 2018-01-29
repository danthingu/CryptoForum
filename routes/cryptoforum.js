var express = require("express");
var router = express.Router();
var Cryptocurrency = require("../models/cryptocurrency");
var helper = require("../helper/index");

//INDEX - show all cryptocurrency forum topic
router.get('/', function(req, res) {
	Cryptocurrency.find({}, function(err, allcryptocurrency) {
		if (err) {
			console.log(err);
		} else {
			res.render('cryptoforum/index', {cryptocurrencies:allcryptocurrency});
		}
	})
});

//NEW - show form to create new cryptocurrency forum topic
router.get('/new', helper.isLoggedIn, function(req, res){
   res.render("cryptoforum/new"); 
});

//CREATE - add new cryptocurrency forum to DB
router.post('/', helper.isLoggedIn, function(req, res) {
	// get data from from and add to cryptocurrency array
	var name = req.body.crypto.name;
	var image = req.body.crypto.image;
	var description = req.body.crypto.description;
	var author = {
        id: req.user._id,
        username: req.user.username
    }
	var newCryptocurrencyForum = {name: name, image:image, description: description, author: author}
	// Create a new cryptocurrency forum and save to the DATABASE
    Cryptocurrency.create(newCryptocurrencyForum, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			// redirect back to index page
			res.redirect('/cryptocurrency')
		}
	});
});

//SHOW - shows more info about one forum
router.get('/:id', helper.isLoggedIn, function(req, res) {
	// find the specific forum with provided ID
	Cryptocurrency.findById(req.params.id).populate("comments").exec(function(err, foundCryptocurrencyForum){
        if(err){
            console.log(err);
        } else {
            //render show template with that cryptocurrency forum
            res.render("cryptoforum/show", {cryptocurrencyForum: foundCryptocurrencyForum});
        }
	});
});

router.get("/:id/edit", helper.checkUserCryptocurrencyForum, function(req, res){
    console.log("IN EDIT!");
    //find the cryptocurrency forum with provided ID
    Cryptocurrency.findById(req.params.id, function(err, foundCryptocurrencyForum){
        if(err){
            console.log(err);
        } else {
            //render show template with that cryptocurrency forum
            res.render("cryptoforum/edit", {cryptocurrencyForum: foundCryptocurrencyForum});
        }
    });
});


router.put("/:id", helper.checkUserCryptocurrencyForum, function(req, res){
    Cryptocurrency.findByIdAndUpdate(req.params.id, req.body.cryptocurrencyForum, function(err, updateCryptocurrencyForum){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
        	console.log(updateCryptocurrencyForum);
            req.flash("success","Successfully Updated!");
            res.redirect("/cryptocurrency/" + req.params.id);
        }
    });
});
module.exports = router;