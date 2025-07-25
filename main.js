import express from "express";
import routes from "./routes/index.js";
import connectMongo from "./config/connection.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = 4000;
const app = express();

app.use(express.json());

//connect to mongodb
connectMongo();

//base route
app.use("/api", routes);

app.listen(PORT, "localhost", (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`server is listening on ${PORT}`);
  }
});
