const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;
// passportlocalmongoose will add a username , hash and salt by default : username and password will be defined by this own
//will also add some in-built methods
const userSchema = new Schema({
    email : {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);
// console.log(userSchema);
module.exports = mongoose.model("User" , userSchema);