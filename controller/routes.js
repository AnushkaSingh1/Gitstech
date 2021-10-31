const express = require('express');
const User = require('../modals/user');
const Post = require('../modals/post');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const faker = require("faker");
const avatar = faker.image;
require('./passportLocal')(passport);


const checkAuth = (req , res , next)=>{
    if(req.isAuthenticated()){
        res.set('cache-control' , 'no-cache , private , no-store , must-revalidate , post-check     = 0 , pre-check = 0');
        next();
    }
    else{
        req.flash('error_message' , 'Please login to continue !')
        res.redirect("/login");
    }
}

router.get("/" , (req , res)=>{
    if(req.isAuthenticated()){
        res.render("login" , {logged : true});
    }
    else{
        res.render("login" , {logged : false});
    }
});

router.get("/" , (req , res)=>{
    res.render("index");
});

router.get("/login" , (req , res)=>{
    res.render("login");
});

router.get("/signup" , (req , res)=>{
    res.render("signup");
});

router.get("/home" , checkAuth , (req , res)=>{
    Post.find({ } , (err , data)=>{
        if(err){
            console.log(err);
        }
        if(data){
            res.render("home" , {username : req.user.username , avatar : avatar , posts : data});
        }
    })
});

router.get("/opportunities" , (req , res)=>{
    res.render("opportunities");
});

router.get("/books" , (req , res)=>{
    res.render("books");
});

router.get("/courses" , (req , res)=>{
    res.render("courses");
});

router.get("/logout" , (req , res)=>{
    req.logout();
    req.session.destroy((err)=>{
        res.redirect("/");
    });
});


// POST
router.post("/post" , (req , res)=>{
    const today = new Date();
    const post = new Post({
        username : req.user.username,
        email : req.user.email,
        date : today.toDateString(),
        content : req.body.content
    }).save((err , data)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("home");
        }
    })
});


router.post('/login' , (req , res , next)=>{
    passport.authenticate('local' , {
        failureRedirect : "/login",
        successRedirect : "/home",
        failureFlash : true
    })(req , res , next);
});

router.post("/signup" , (req , res)=>{
    // Take everything in the req.body
    const {email , username , password , confirmPassword} =  req.body;

    // check if they are empty
    if(!email || !username || !password || !confirmPassword){
        // The err is to show up as an alert
        res.render("signup" , {err : "All feilds are not present" , csrfToken : req.csrfToken() });
    }
    else if(password !== confirmPassword){
        // The password should be equal to confirm password
        res.render("signup" , {err : "Passwords doesnt match" , csrfToken : req.csrfToken() });
    }
    else{
        // check if the user exists already
        User.findOne({email : email} , (err , data)=>{
            if(err){
                console.log(err);
            }
            if(data){
                // The user already exists
                res.render("signup" , {err : "User already exists, try logging in" , csrfToken : req.csrfToken() });
            }
            else{
                // If the user doesnt exist
                // generate a salt
                bcryptjs.genSalt(10 , (err , salt)=>{
                    if(err){
                        console.log(err);
                    }
                    // hash the password
                    bcryptjs.hash(password , salt , (err , hash)=>{
                        if(err){
                            console.log(err);
                        }
                        // save the user in the database
                        User({
                            username : username,
                            email : email,
                            password : hash,
                        }).save((err , data)=>{
                            if(err){
                                console.log(err)
                            }
                            // login the user or redirect him to the login page
                            res.redirect("/login");
                        });
                    });
                });                
            }
        });
    }
});

module.exports = router;
