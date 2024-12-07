const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use('/public', express.static('public'));
const cors = require("cors");
const { default: axios } = require("axios");
const SearchRouter = require("./Router/SearchRouter");
const dashboarddataRouter = require("./Router/dashboarddataRouter");
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

app.use("/search",SearchRouter);
app.use("/dashboard",dashboarddataRouter)


const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log("Server is running on port " + Port);
});

