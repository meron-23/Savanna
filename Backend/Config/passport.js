import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import mySqlConnection from "./db.js";

dotenv.config();

// Serialization - Only store minimal user identifier
passport.serializeUser((user, done) => {
  done(null, user.userId); // Only store userId in session
});

passport.deserializeUser(async (userId, done) => {
  try {
    const [rows] = await mySqlConnection.query(
      "SELECT userId, name, email, role FROM users WHERE userId = ?",
      [userId]
    );
    done(null, rows[0] || null);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true, // Gives access to req object
  scope: ['profile', 'email'] // Explicitly request these scopes
}, 
async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Validate profile has email
    if (!profile.emails || !profile.emails.length) {
      return done(null, false, { 
        message: "No email found in Google profile" 
      });
    }

    const email = profile.emails[0].value;
    const [rows] = await mySqlConnection.query(
      `SELECT userId, name, email, role 
       FROM users 
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return done(null, false, { 
        message: "No account found with this Google email" 
      });
    }

    const user = rows[0];
    return done(null, user);
  } catch (err) {
    console.error('Google Auth Error:', err);
    return done(err);
  }
}));

export default passport;