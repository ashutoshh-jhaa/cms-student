import express from "express";
import {
  addFaculty,
  addStudent,
  deleteFaculty,
  deleteStudent,
  getAdminDetails,
  getAllFaculties,
  getAllStudents,
  getFaculty,
  getStudent,
  updateAdminDetails,
  updateFaculty,
  updateStudent,
} from "../controller/admin.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

//get all the faculties
router.get("/faculty", getAllFaculties);

//add faculty
router.post("/faculty", upload.single("photo"), addFaculty);

//get faculty by id
router.get("/faculty/:id", getFaculty);

//update faculty by id
router.put("/faculty/:id", upload.single("photo"), updateFaculty);

//delete faculty by id
router.delete("/faculty/:id", deleteFaculty);

//get all students
router.get("/student", getAllStudents);

//add a student
router.post("/student", addStudent);

//get student by id
router.get("/student/:id", getStudent);

//update student by id
router.put("/student/:id", updateStudent);

//delete student by id
router.delete("/student/:id", deleteStudent);

//admin details
router.get("/:id", getAdminDetails);

//update details
router.put("/:id", updateAdminDetails);

export default router;
