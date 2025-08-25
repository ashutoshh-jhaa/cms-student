import express from "express";
import {
  getFaculty,
  updateFaculty,
  getAllStudents,
  getStudent,
  updateStudent,
} from "../controller/faculty.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

// Get all students under this faculty
router.get("/student", getAllStudents);

// Get a student by id under this faculty
router.get("/student/:id", getStudent);

// Update a student by id under this faculty
router.put("/student/:id", upload.single("photo"), updateStudent);

// Get faculty details by id
router.get("/:id", getFaculty);

// Update faculty details by id
router.put("/:id", upload.single("photo"), updateFaculty);

export default router;
