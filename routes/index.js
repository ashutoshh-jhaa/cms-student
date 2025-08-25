import express from "express";
import adminRouter from "./admin.routes.js";
import facultyRouter from "./faculty.routes.js";
import studentRouter from "./student.routes.js";
import authRouter from "./auth.routes.js";

const routes = express.Router();

//open routes for authentication
routes.use("/auth", authRouter);

//protect all of these routes
routes.use("/admin", adminRouter);
routes.use("/faculty", facultyRouter);
routes.use("/student", studentRouter);

export default routes;
