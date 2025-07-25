import bcrypt from "bcrypt";
import facultyModel from "../model/faclty.model.js";
import studentModel from "../model/student.model.js";

// Get faculty details by ID
export const getFaculty = async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await facultyModel.findById(id);
    if (!faculty) {
      return res.status(404).json({
        status: false,
        message: "Faculty does not exist",
      });
    }
    res.status(200).json({
      status: true,
      message: "Faculty details fetched",
      data: faculty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching faculty",
    });
  }
};

// Update faculty details by ID
export const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, gender, dob, city, state } =
    req.body;

  const updateFields = {
    firstName,
    lastName,
    email,
    phone,
    gender,
    dob,
    city,
    state,
  };
  try {
    const updatedFaculty = await facultyModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true },
    );

    if (!updateFaculty) {
      return res.status(404).json({
        status: false,
        message: "Faculty does not exist",
      });
    }
    res.status(200).json({
      status: true,
      message: "Faculty updated successfully",
      data: updatedFaculty,
    });
  } catch (error) {
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
    const students = await studentModel.find({});
    if (students.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No students found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Students fetched",
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching students",
    });
  }
};

// Get student by ID
export const getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentModel.findById(id);
    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }
    res.status(200).json({
      status: true,
      message: "Student details fetched",
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching student",
    });
  }
};

// Update student by ID
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, gender, email, phone, dob, city, state } =
    req.body;

  const updateFields = {
    firstName,
    lastName,
    gender,
    email,
    phone,
    dob,
    city,
    state,
  };

  try {
    const updatedStudent = await studentModel.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
      },
    );
    if (!updateStudent) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }
    res.status(200).json({
      status: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong updating student",
    });
  }
};
