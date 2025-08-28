import bcrypt from "bcrypt";
import loginSchema from "../services/validation/loginValidation.js";
import Faculty from "../model/faculty.model.js";
import jwt from "jsonwebtoken";
import Admin from "../model/admin.model.js";
import Student from "../model/student.model.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = "1h";

//implement this last
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error, value } = loginSchema.validate({ email, password });
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: "field validation failed" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ status: false, message: "admin doesn't exists" });
    }

    const isValidPass = await bcrypt.compare(password, admin.password);
    if (!isValidPass) {
      return res
        .status(401)
        .json({ status: false, message: "invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: true,
      message: "login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something went wrong on server ",
    });
  }
};

export const facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error, value } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res
        .status(404)
        .json({ status: false, message: "faculty doesn't exists" });
    }

    const isValidPass = await bcrypt.compare(password, faculty.password);
    if (!isValidPass) {
      return res
        .status(401)
        .json({ status: false, message: "invalid credentials" });
    }

    const token = jwt.sign(
      { id: faculty.id, role: faculty.role },
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.status(200).json({
      status: true,
      message: "login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something went wrong on server ",
    });
  }
};

export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error, value } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ status: false, message: error.message });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "student doesn't exists" });
    }

    const isValidPass = await bcrypt.compare(password, student.password);
    if (!isValidPass) {
      return res
        .status(401)
        .json({ status: false, message: "invalid credentials" });
    }

    const token = jwt.sign(
      { id: student.id, role: student.role },
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.status(200).json({
      status: true,
      message: "login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something went wrong on server ",
    });
  }
};
