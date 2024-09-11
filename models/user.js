const { ref } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new schema({
    //username , password => passportlocalmongoose will automatically create it.
    email: {
        type: String,
        required : true,
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;