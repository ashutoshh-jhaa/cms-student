import bcrypt from "bcrypt";
import facultyModel from "../model/faculty.model.js";
import studentModel from "../model/student.model.js";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import { cloudinaryFileUpload } from "../services/cloudinary/fileUpload.js";
import { cloudinaryFileDelete } from "../services/cloudinary/fileDelete.js";
import facultySchema from "../services/validation/facultyValidation.js";
import studentSchema from "../services/validation/studentValidation.js";

const { ObjectId } = mongoose.Types;

// Get faculty details by ID
export const getFaculty = async (req, res) => {
  // Extract ID from request parameters
  const { id } = req.params;
  console.log(id);
  try {
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }
    // Query database for faculty by ID
    const faculty = await facultyModel.findById(id);
    if (!faculty) {
      return res.status(404).json({
        status: false,
        message: "Faculty does not exist",
      });
    }
    // Return faculty details
    res.status(200).json({
      status: true,
      message: "Faculty details fetched",
      data: faculty,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching faculty",
    });
  }
};

// Update faculty details by ID
export const updateFaculty = async (req, res) => {
  // Extract ID from request parameters
  const { id } = req.params;
  try {
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }
    // Check if any fields are provided for update
    if (Object.keys(req.body).length === 0 && !req.file) {
      return res.status(400).json({
        status: false,
        message: "No fields provided to update",
      });
    }

    // Create a modified schema for partial updates
    const updatedFacultySchema = facultySchema
      .fork(
        [
          "firstName",
          "lastName",
          "gender",
          "dob",
          "city",
          "state",
          "department",
          "designation",
          "courses",
        ],
        (schema) => schema.optional(),
      )
      .fork(["email", "password", "phone"], (schema) => schema.forbidden());

    // Validate request body
    const { error, value } = updatedFacultySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Faculty validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    // Handle profile picture update if provided
    if (req.file) {
      // Fetch existing faculty to get current image publicId
      const facultyDetails = await facultyModel.findById(id);
      if (!facultyDetails) {
        return res.status(404).json({
          status: false,
          message: "Faculty does not exist",
        });
      }
      const imagePublicId = facultyDetails.image?.publicId;

      try {
        // Upload new image to Cloudinary
        const imagePath = req.file.path;
        const imageOriginalName = req.file.originalname;
        const uploadImageResult = await cloudinaryFileUpload(
          imagePath,
          "faculty",
        );

        // Update image details in value object
        value.image = {
          originalName: imageOriginalName,
          url: uploadImageResult.url,
          publicId: uploadImageResult.public_id,
        };

        // Delete temporary file and old Cloudinary image (if exists)
        await fs.unlink(imagePath);
        if (imagePublicId) {
          await cloudinaryFileDelete(imagePublicId);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          message: "Something went wrong uploading image",
        });
      }
    }

    // Update faculty in database
    const updatedFaculty = await facultyModel.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!updatedFaculty) {
      return res.status(404).json({
        status: false,
        message: "Faculty does not exist",
      });
    }

    // Return updated faculty details
    res.status(200).json({
      status: true,
      message: "Faculty updated successfully",
      data: updatedFaculty,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong updating faculty",
    });
  }
};

// Get all students (under faculty scope or generally)
export const getAllStudents = async (req, res) => {
  try {
    // Query database for all student records
    const students = await studentModel.find({});
    if (students.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No students found",
      });
    }
    // Return student details
    res.status(200).json({
      status: true,
      message: "Students fetched",
      data: students,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching students",
    });
  }
};

// Get student by ID
export const getStudent = async (req, res) => {
  // Extract ID from request parameters
  const { id } = req.params;
  try {
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }
    // Query database for student by ID
    const student = await studentModel.findById(id);
    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }
    // Return student details
    res.status(200).json({
      status: true,
      message: "Student details fetched",
      data: student,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching student",
    });
  }
};

// Update student by ID
export const updateStudent = async (req, res) => {
  // Extract ID from request parameters
  const { id } = req.params;
  try {
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }
    // Check if any fields are provided for update
    if (Object.keys(req.body).length === 0 && !req.file) {
      return res.status(400).json({
        status: false,
        message: "No fields provided to update",
      });
    }

    // Create a modified schema for partial updates
    const updateStudentSchema = studentSchema
      .fork(
        ["firstName", "lastName", "gender", "dob", "city", "state"],
        (schema) => schema.optional(),
      )
      .fork(["email", "phone", "password"], (schema) => schema.forbidden());

    // Validate request body
    const { error, value } = updateStudentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Student validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    // Handle profile picture update if provided
    if (req.file) {
      // Fetch existing student to get current image publicId
      const studentDetails = await studentModel.findById(id);
      if (!studentDetails) {
        return res.status(404).json({
          status: false,
          message: "Student does not exist",
        });
      }
      const imagePublicId = studentDetails.image?.publicId;

      try {
        // Upload new image to Cloudinary
        const imagePath = req.file.path;
        const imageOriginalName = req.file.originalname;
        const uploadImageResult = await cloudinaryFileUpload(
          imagePath,
          "student",
        );

        // Update image details in value object
        value.image = {
          originalName: imageOriginalName,
          url: uploadImageResult.url,
          publicId: uploadImageResult.public_id,
        };

        // Delete temporary file and old Cloudinary image (if exists)
        await fs.unlink(imagePath);
        if (imagePublicId) {
          await cloudinaryFileDelete(imagePublicId);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          message: "Something went wrong uploading image",
        });
      }
    }

    // Update student in database
    const updatedStudent = await studentModel.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }

    // Return updated student details
    res.status(200).json({
      status: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong updating student",
    });
  }
};
