import bcrypt from "bcrypt";
import studentModel from "../model/student.model.js";
import facultyModel from "../model/faculty.model.js";
import adminModel from "../model/admin.model.js";
import fs from "node:fs/promises";
import mongoose from "mongoose";
import { cloudinaryFileUpload } from "../services/cloudinary/fileUpload.js";
import facultySchema from "../services/validation/facultyValidation.js";
import studentSchema from "../services/validation/studentValidation.js";
import { cloudinaryFileDelete } from "../services/cloudinary/fileDelete.js";
import adminSchema from "../services/validation/adminValidation.js";

const { ObjectId } = mongoose.Types;

// Get admin details by ID
export const getAdminDetails = async (req, res) => {
  // Extract ID from request parameters
  const { id } = req.params;
  try {
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }
    // Query database for admin by ID
    const adminExists = await adminModel.findById(id);
    if (!adminExists) {
      return res.status(404).json({
        status: false,
        message: "Admin does not exist",
      });
    }
    // Return admin details on success
    res.status(200).json({
      status: true,
      message: "Records served",
      data: adminExists,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching admin details",
    });
  }
};

// Update admin details by ID
export const updateAdminDetails = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }

    //validate fields
    const updatedAdminSchema = adminSchema
      .fork(
        ["firstName", "lastName", "gender", "dob", "city", "state"],
        (schema) => schema.optional(),
      )
      .fork(["email", "password"], (schema) => schema.forbidden());

    const { error, value } = updatedAdminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Admin validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    // Update admin in database and return updated document
    const updatedAdmin = await adminModel.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!updatedAdmin) {
      return res.status(404).json({
        status: false,
        message: "Admin does not exist",
      });
    }

    // Return updated admin details
    res.status(200).json({
      status: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong updating admin details",
    });
  }
};

// Get all faculties
export const getAllFaculties = async (req, res) => {
  try {
    // Query database for all faculty records
    const faculties = await facultyModel.find({});
    if (faculties.length > 0) {
      // Return faculties if found
      res.status(200).json({
        status: true,
        message: "Request successful",
        data: faculties,
      });
    } else {
      // Return 404 if no faculties found
      res.status(404).json({ status: false, message: "No faculties found" });
    }
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching faculties",
    });
  }
};

// Add a new faculty
export const addFaculty = async (req, res) => {
  try {
    // Check if profile picture is provided
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "Profile picture is required" });
    }

    // Validate request body using faculty schema
    const { error, value } = facultySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    // Hash the password for security
    value.password = await bcrypt.hash(value.password, 10);

    // Upload profile picture to Cloudinary
    const imagePath = req.file.path;
    const imageOriginalName = req.file.originalname;
    const uploadResult = await cloudinaryFileUpload(imagePath, "faculty");

    // Store image details in the value object
    value.image = {
      originalName: imageOriginalName,
      url: uploadResult.url,
      publicId: uploadResult.public_id,
    };

    // Create new faculty in database
    const faculty = await facultyModel.create(value);
    // Delete temporary file from server
    try {
      await fs.unlink(imagePath);
    } catch (unlinkError) {
      console.error(`Failed to delete temporary file: ${unlinkError.message}`);
    }

    // Return created faculty details
    res.status(201).json({
      status: true,
      message: "Faculty added successfully",
      data: faculty,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong adding faculty",
    });
  }
};

// Get faculty by ID
export const getFaculty = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }
    // Query database for faculty by ID
    const faculty = await facultyModel.findById(id);
    if (faculty) {
      // Return faculty details if found
      res.status(200).json({
        status: true,
        message: "Request successful",
        data: faculty,
      });
    } else {
      // Return 404 if faculty not found
      res.status(404).json({
        status: false,
        message: "Faculty does not exist",
      });
    }
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching faculty",
    });
  }
};

// Update faculty by ID
export const updateFaculty = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
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
      const imagePublicId = facultyDetails.image.publicId;

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

        // Delete temporary file and old Cloudinary image
        await fs.unlink(imagePath);
        await cloudinaryFileDelete(imagePublicId);
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
    return res.status(200).json({
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

// Delete faculty by ID
export const deleteFaculty = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }

    // Fetch faculty to get image publicId
    const faculty = await facultyModel.findById(id);
    if (!faculty) {
      return res
        .status(404)
        .json({ status: false, message: "Faculty does not exist" });
    }

    // Delete faculty and associated Cloudinary image
    const { image } = faculty;
    const deleted = await facultyModel.findByIdAndDelete(id);
    await cloudinaryFileDelete(image.publicId);

    // Return success message
    return res.status(200).json({
      status: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong deleting faculty",
    });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    // Query database for all student records
    const students = await studentModel.find({});
    if (students.length > 0) {
      // Return students if found
      res.status(200).json({
        status: true,
        message: "Fetching successful",
        data: students,
      });
    } else {
      // Return 404 if no students found
      res.status(404).json({
        status: false,
        message: "No students found",
      });
    }
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching student records",
    });
  }
};

// Add a new student
export const addStudent = async (req, res) => {
  try {
    // Check if profile picture is provided
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "Profile picture is required" });
    }

    // Validate request body using student schema
    const { error, value } = studentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    // Hash the password for security
    value.password = await bcrypt.hash(value.password, 10);

    // Upload profile picture to Cloudinary
    const imagePath = req.file.path;
    const imageOriginalName = req.file.originalname;
    const uploadResult = await cloudinaryFileUpload(imagePath, "student");

    // Store image details in value object
    value.image = {
      originalName: imageOriginalName,
      url: uploadResult.url,
      publicId: uploadResult.public_id,
    };

    // Create new student in database
    const student = await studentModel.create(value);
    // Delete temporary file from server
    try {
      await fs.unlink(imagePath);
    } catch (unlinkError) {
      console.error(`Failed to delete temporary file: ${unlinkError.message}`);
    }

    // Return created student details
    res.status(201).json({
      status: true,
      message: "Student added successfully",
      data: student,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong creating student",
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
    const studentExists = await studentModel.findById(id);
    if (!studentExists) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }
    // Return student details
    res.status(200).json({
      status: true,
      message: "Records served",
      data: studentExists,
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
  try {
    // Extract ID from request parameters
    const { id } = req.params;
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
      const imagePublicId = studentDetails.image.publicId;

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

        // Delete temporary file and old Cloudinary image
        await fs.unlink(imagePath);
        await cloudinaryFileDelete(imagePublicId);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          message: "Something went wrong uploading image",
        });
      }
    }

    // Update student in database
    const updatedRecords = await studentModel.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!updatedRecords) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }

    // Return updated student details
    res.status(200).json({
      status: true,
      message: "Records updated",
      data: updatedRecords,
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong updating student details",
    });
  }
};

// Delete student by ID
export const deleteStudent = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid ID format" });
    }

    // Fetch student to get image publicId
    const student = await studentModel.findById(id);
    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }

    // Delete student and associated Cloudinary image
    const { image } = student;
    const deleteStudent = await studentModel.findByIdAndDelete(id);
    await cloudinaryFileDelete(image.publicId);

    // Return success message
    res.status(200).json({
      status: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong deleting student",
    });
  }
};
