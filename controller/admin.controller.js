import bcrypt from "bcrypt";
import studentModel from "../model/student.model.js";
import facultyModel from "../model/faclty.model.js";
import adminModel from "../model/admin.model.js";

// Get admin details
export const getAdminDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const adminExists = await adminModel.findById(id);
    if (!adminExists) {
      return res.status(404).json({
        status: false,
        message: "Admin does not exist",
      });
    }
    res.status(200).json({
      status: true,
      message: "Records served",
      data: adminExists,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching admin details",
    });
  }
};

// Update admin details
export const updateAdminDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const adminExists = await adminModel.findById(id);

    if (!adminExists) {
      return res.status(404).json({
        status: false,
        message: "Admin does not exist",
      });
    }

    const updatedAdmin = await adminModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
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
    const faculties = await facultyModel.find({});
    if (faculties.length > 0) {
      res.status(200).json({
        status: true,
        message: "Request successful",
        data: faculties,
      });
    } else {
      res.status(404).json({ status: false, message: "No faculties found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

// Add a faculty
export const addFaculty = async (req, res) => {
  const { password } = req.body;
  if (req.file) {
    console.log("file was received");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const faculty = await facultyModel.create(req.body);
    res.status(201).json({
      status: true,
      message: "Faculty created",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong adding faculty",
    });
  }
};

// Get faculty by id
export const getFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await facultyModel.findById(id);
    if (faculty) {
      res.status(200).json({
        status: true,
        message: "Request successful",
        data: faculty,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Faculty does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      city,
      state,
      department,
      designation,
      courses,
    } = req.body;

    const updateFields = {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      city,
      state,
      department,
      designation,
      courses,
    };

    //this returns null if id  does not exists
    const updatedFaculty = await facultyModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true },
    );

    //if null, faculty doesnot exists
    if (!updatedFaculty) {
      return res.status(404).json({
        status: false,
        message: "Faculty does not exist",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Faculty updated successfully",
      data: updatedFaculty,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await facultyModel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ status: false, message: "Faculty does not exist" });
    }

    return res.status(200).json({
      status: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.find({});

    if (students.length > 0) {
      res.status(200).json({
        status: true,
        message: "Fetching successfull",
        data: students,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Students does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    req.status(500).json({
      status: false,
      message: "something went fetching student records",
    });
  }
};

// Add student
export const addStudent = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const student = await studentModel.create(req.body);
    res.status(201).json({
      status: true,
      message: "Student was added successfully",
      data: student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong creating student",
    });
  }
};

// Get student by id
export const getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const studentExists = await studentModel.findById(id);
    if (!studentExists) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }
    res.status(200).json({
      status: true,
      message: "Records served",
      data: studentExists,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong fetching student",
    });
  }
};

// Update student
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
    const updatedRecords = await studentModel.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
      },
    );

    if (!updatedRecords) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }

    res.status(200).json({
      status: true,
      message: "Records updated",
      data: updatedRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong updating student details",
    });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteStudent = await studentModel.findByIdAndDelete(id);
    if (!deleteStudent) {
      return res.status(404).json({
        status: false,
        message: "Student does not exist",
      });
    }
    res.status(200).json({
      status: true,
      message: "Student deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong deleting student",
    });
  }
};
