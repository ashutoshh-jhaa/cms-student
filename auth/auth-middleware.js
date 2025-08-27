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
    const { role } = req.user;

    if (!roles.includes(role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  };
};

export const ownDataOnly = (resourceType) => {
  return (req, res, next) => {
    const { id: userId, role } = req.user;
    const requestId = req.params.id;

    if (
      role === "student" &&
      resourceType == "student" &&
      userId != requestId
    ) {
      return res.status(403).json({
        status: false,
        message: "Forbidden: Access denied",
      });
    }

    if (role == "faculty" && resourceType == "faculty" && userId != requestId) {
      return res.status(403).json({
        status: false,
        message: "Forbidden: Access denied",
      });
    }

    if (role == "admin" && resourceType == "admin" && userId != requestId) {
      return res.status(403).json({
        status: false,
        message: "Forbidden: Access denied",
      });
    }
    next();
  };
};
