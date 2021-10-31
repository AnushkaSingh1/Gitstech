const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_CONN  , {useNewUrlParser : true , useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    // password is not required as we can also use google authentication
    password : String,
});

const User = mongoose.model('user' , userSchema);
module.exports = User;