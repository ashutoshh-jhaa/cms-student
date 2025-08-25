import bcrypt from "bcrypt";
import loginSchema from "../services/validation/loginValidation";
import Faculty from "../model/faculty.model";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//implement this last
export const adminLogin = (req, res) => {};

export const facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error, value } = loginSchema.validate({ email, password });
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: "field validation failed" });
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

export const studentLogin = (req, res) => {};
