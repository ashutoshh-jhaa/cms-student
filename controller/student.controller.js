import bcrypt from "bcrypt";
import studentModel from "../model/student.model.js";

// Get student details by ID
export const getStudentDetails = async (req, res) => {
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

// Update student details by ID
export const updateStudentDetails = async (req, res) => {
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
    if (!updatedStudent) {
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
