// middleware/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔑 Helper to issue token
const issueToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "oauth_google", // dummy placeholder
          });
        }
        const token = issueToken(user);
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email,
            password: "oauth_github",
          });
        }
        const token = issueToken(user);
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "displayName"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            password: "oauth_facebook",
          });
        }
        const token = issueToken(user);
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
