const mongoose = require('mongoose');
const URI = require("../config");
mongoose.connect(URI  , {useNewUrlParser : true , useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
    username : {
        type : String,
    },
    email : {
        type : String,
    },
    Date : String,
    content : String,

})

const Post = mongoose.model('post' , postSchema);
module.exports = Post;