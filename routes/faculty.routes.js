import express from "express";
import {
  getFaculty,
  updateFaculty,
  getAllStudents,
  getStudent,
  updateStudent,
} from "../controller/faculty.controller.js";

const router = express.Router();

// Get all students under this faculty
router.get("/student", getAllStudents);

// Get a student by id under this faculty
router.get("/student/:id", getStudent);

// Update a student by id under this faculty
router.put("/student/:id", updateStudent);

// Get faculty details by id
router.get("/:id", getFaculty);

// Update faculty details by id
router.put("/:id", updateFaculty);

export default router;
