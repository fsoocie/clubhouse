import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../../models";
import { createJwtToken } from "../utils/createJWT";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/github/callback",
    },
    async function (_, __, profile, done) {
      try {
        let userData;
        const object = {
          fullname: profile.displayName,
          avatarUrl: profile.photos?.[0].value,
          isActive: 0,
          username: profile.username,
          phone: "",
        };

        const existUser = await User.findOne({
          where: { username: object.username },
        });

        if (existUser) {
          userData = existUser.toJSON();
        } else {
          const user = await User.create(object);
          userData = user.toJSON();
        }
        done(null, {
          ...userData,
          token: createJwtToken(userData),
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  "jwt",
  new JwtStrategy(opts, function (jwt_payload, done) {
    return done(null, jwt_payload);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

export default passport;
