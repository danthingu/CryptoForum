var express = require('express');
var router = express.Router({mergeParams: true});
var CryptocurrencyForum = require('../models/cryptocurrency');
var Comment = require('../models/comment');
var helper = require('../helper/index');

// Comments new
router.get('/new', helper.isLoggedIn, function(req, res) {
	CryptocurrencyForum.findById(req.params.id, function(err, newCryptocurrencyForum) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', {cryptocurrencyForum: newCryptocurrencyForum});
		}
	})
});


//Comments Create
router.post("/", helper.isLoggedIn, function(req, res){
   //lookup campground using ID
   CryptocurrencyForum.findById(req.params.id, function(err, foundCryptocurrencyForum){
       if(err){
           console.log(err);
           res.redirect("/cryptocurrency");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               foundCryptocurrencyForum.comments.push(comment);
               foundCryptocurrencyForum.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/cryptocurrency/' + cryptocurrency._id);
           }
        });
       }
   });
});


router.get("/:comment_id/edit", helper.checkUserComment, function(req, res){
    // find campground by id
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {cryptocurrrency_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:comment_id", helper.checkUserComment, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
       	console.log(req.body.comment);
           res.redirect("/cryptocurrency/" + req.params.id);
       }
   }); 
});

router.delete("/:comment_id",helper.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/cryptocurrency/" + req.params.id);
        }
    })
});

module.exports = router;