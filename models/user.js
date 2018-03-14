var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);