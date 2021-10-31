const User = require('../modals/user');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

const verify = (passport)=>{
    passport.use(new localStrategy({usernameField : 'email'} , (email , password , done)=>{
        // This email , password comes from the login route
        User.findOne({email : email} , (err , data)=>{
            if(err){
                console.log(err);
            }
            if(!data){
                // No user with that email is present
                return done(null , false , {message : "User doesn;t exist"});
            }
            // if the user exist
            // check if the password is correct
            // password is what the user has entered
            // data.password is what was there in our data-base
            bcryptjs.compare(password , data.password , (err , match)=>{
                if(err){
                    // There was an error matching the data
                    return done(null , false);
                }
                if(!match){
                    // The passwords doesnt match
                    return done(null , false , {message : "Passwords doesnt match"});
                }
                if(match){
                    // The passwords match
                    // then we say null for no error and data is sent
                    return done(null , data);
                }
            });
        });
    }));
    // serialize and deserialize
    passport.serializeUser((user , done)=>{
        done(null , user.id);

    });
    passport.deserializeUser((id , done)=>{
        User.findById(id , (err , user)=>{
            done(err , user);
        });
    });
}

module.exports = verify;