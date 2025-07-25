import mongoose from "mongoose";

const URL = "mongodb://localhost:27017/ems";

const connectMongo = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongo;
