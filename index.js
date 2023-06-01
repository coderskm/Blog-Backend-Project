require('dotenv').config();
const express = require("express");
const route = require("./routes/route.js");
const app = express();

app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Express app running on port " + port);
});
