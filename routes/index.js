import express from "express";
import adminRouter from "./admin.routes.js";
import facultyRouter from "./faculty.routes.js";
import studentRouter from "./student.routes.js";

const routes = express.Router();

routes.use("/admin", adminRouter);

routes.use("/faculty", facultyRouter);

routes.use("/student", studentRouter);

export default routes;
