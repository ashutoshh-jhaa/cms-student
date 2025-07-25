import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    courses: { type: [String], required: true },
  },
  { timestamps: true },
);

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
