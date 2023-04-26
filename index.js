const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/config");

// Importing Routes
const userRoutes = require("./routes/userRoutes");

dotenv.config();

// Connecting to mongodb server
connectDB();

// express application
const app = express();

// allow CORS
app.use(cors());

// Inbuilt Body Parser middleware, no need to install body-parser package
app.use(express.json());

//Port
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Welcome to our portal!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error,
    });
  }
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
