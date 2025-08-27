import passport from "../auth/passport.js";

export const authenticateJwt = passport.authenticate("jwt", {
  session: false,
});

//more controlled error message
// export const authenticateJwt = (req, res, next) => {
//   passport.authenticate("jwt", { session: false }, (err, user) => {
//     if (err) return next(err);
//     if (!user) return res.status(401).json({ message: "Unauthorized shit" });

//     req.user = user;
//     next();
//   })(req, res, next);
// };

export const authorize = (roles = []) => {
  return (req, res, next) => {
    console.log(req.body.user);
    const { role } = req.body.user;

    if (!roles.includes(role)) {
      return res.status(403).json({
        message: "shit",
      });
    }

    next();
  };
};

// export const accessOwnDataOnly = (resourceType) => {
//   return (req, res, next) => {};
// };
