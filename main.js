import express from "express";
import routes from "./routes/index.js";
import connectMongo from "./config/connection.js";
import passport from "passport";

const PORT = 4000;
const app = express();

//initialize passport.js
app.use(passport.initialize());

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
