const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_CONN  , {useNewUrlParser : true , useUnifiedTopology: true});

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