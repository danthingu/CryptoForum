var Cryptocurrency = require('../models/cryptocurrency');
var Comment = require('../models/comment');

let isLoggedIn = function(req,res, next){
	if (req.isAuthenticated()) {
		return next();
	} 
	res.redirect('/login');
};

let checkUserCryptocurrencyForum = function(req, res, next) {
	if(req.isAuthenticated()) {
		Cryptocurrency.findById(req.params.id, function(err, foundCryptocurrencyForum) {
			if(foundCryptocurrencyForum.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect('/cryptocurrency' + req.params.id);
			}
		});
	} else {
		req.flash('error', 'You need to be signed in to do that');
		res.redirect('/login');
	}
};

let checkUserComment = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.commentId, function(err, foundComment) {
			if(comment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that!");
                res.redirect("/cryptocurrency/" + req.params.id);
			}
		});
	}	else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
    }
}


module.exports = {
	isLoggedIn,
	checkUserCryptocurrencyForum,
	checkUserComment
}