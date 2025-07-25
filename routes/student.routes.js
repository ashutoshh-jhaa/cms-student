import express from "express";
import {
  getStudentDetails,
  updateStudentDetails,
} from "../controller/student.controller.js";

const router = express.Router();

router.get("/:id", getStudentDetails);

router.put("/:id", updateStudentDetails);

export default router;
