import express from "express";
import {
  adminLogin,
  facultyLogin,
  studentLogin,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/faculty/login", facultyLogin);
router.post("/student/login", studentLogin);

export default router;
