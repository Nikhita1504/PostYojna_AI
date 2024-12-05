
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use('/public', express.static('public'));
const cors = require("cors");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
require("./model/db")
app.use(
  cors({
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
    origin: "http://localhost:5173",
  })
);


const Port = process.env.Port || 3000;
app.listen(Port, () => {
  console.log("Server is running on port " + Port);
});
