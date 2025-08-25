import express from "express";
import {
  getStudentDetails,
  updateStudentDetails,
} from "../controller/student.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/:id", getStudentDetails);

router.put("/:id", upload.single("photo"), updateStudentDetails);

export default router;
