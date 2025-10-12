const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const manageRoutes= require("./routes/manageRoutes");
const PORT = process.env.PORT || 3000;
const bodyParser= require("body-parser");

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/task",manageRoutes)
app.use(bodyParser.json())

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
//
connectDB().then(()=>{ 
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});

