const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        let user = await User.findOne({ email });
        if (user) {
          return done(null, user);
        }

        const baseUsername =
          profile.displayName?.replace(/\s+/g, "").toLowerCase() || "user";

        let username = baseUsername;
        let suffix = 0;

        while (await User.exists({ username })) {
          suffix += 1;
          username = `${baseUsername}${suffix}`;
        }

        user = await User.create({
          email,
          username,
          provider: "google",
          avatarUrl: profile.photos?.[0]?.value,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
