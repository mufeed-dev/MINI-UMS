const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ums");

const express = require("express");
const app = express();

// user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);
//  admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

app.listen(3000, () => {
  console.log("Server is running...");
});
