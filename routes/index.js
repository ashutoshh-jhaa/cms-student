import express from "express";
import adminRouter from "./admin.routes.js";
import facultyRouter from "./faculty.routes.js";
import studentRouter from "./student.routes.js";
import authRouter from "./auth.routes.js";
import passport from "../auth/passport.js";
import {
  ownDataOnly,
  authenticateJwt,
  authorize,
} from "../auth/auth-middleware.js";

const routes = express.Router();

//open routes for authentication
routes.use("/auth", authRouter);

//protect all of these routes
routes.use(
  "/admin",
  authenticateJwt,
  authorize(["admin"]),
  // ownDataOnly("admin"),
  adminRouter,
);

routes.use(
  "/faculty",
  authenticateJwt,
  authorize(["admin", "faculty"]),
  ownDataOnly("faculty"),
  facultyRouter,
);

routes.use(
  "/student",
  authenticateJwt,
  authorize(["admin", "faculty", "student"]),
  ownDataOnly("student"),
  studentRouter,
);

export default routes;
