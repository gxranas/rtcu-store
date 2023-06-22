import GoogleStrategy from 'passport-google-oauth20'
GoogleStrategy.Strategy;
import passport from 'passport';
import { UsersModel } from '../models/Users.js';
import dotenv from 'dotenv'
dotenv.config();

passport.use( new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRETS,
    callbackURL: "/auth/google/callback",
  },
  async function (accessToken, refreshToken, profile, callback) {
    try
    {
        const user = await UsersModel.findOne({email: profile.emails[0].value});
        if(user){
          callback(null,user);
        }
        else
        {
          let newUser = {
            google_email: profile.emails[0].value,
            google_name: profile.name.givenName + ' ' + profile.name.familyName,
          };
          const insert = new UsersModel({
            email: newUser.google_email,
            name: newUser.google_name,
            verified: true,
          })

          await insert.save();
          const findNewUser = await UsersModel.findOne({email: newUser.google_email});
          callback(null,findNewUser);
        }
    }
    catch(err){
      callback(err,null);
    }

  }
));

passport.serializeUser((user, callback) => {
    callback(null, user);
});
  
passport.deserializeUser(async (user, callback) => {
   const findUser = await UsersModel.findOne({email: user.email})
    callback(null, findUser);
});

export {passport as PassportSetup} 