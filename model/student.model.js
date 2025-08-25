import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
    role: { type: String, required: true, default: "student" },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);

//use this model for crud operations
export default Student;
