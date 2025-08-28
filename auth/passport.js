import passport from "passport";
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import Admin from "../model/admin.model.js";
import Faculty from "../model/faculty.model.js";
import Student from "../model/student.model.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  new jwtStrategy(opts, async (payload, done) => {
    const { id, role } = payload;
    let user;

    if (role == "admin") {
      user = await Admin.findById(id);
    } else if (role == "faculty") {
      user = await Faculty.findById(id);
    } else if (role == "student") {
      user = await Student.findById(id);
    }

    if (user) {
      done(null, user); //attach user to req.user
    } else {
      done(null, false);
    }
  }),
);

export default passport;
