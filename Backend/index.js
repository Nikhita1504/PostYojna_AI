const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use('/public', express.static('public'));
const cors = require("cors");
const { default: axios } = require("axios");
const chatgptRouter = require("./Router/chatgpt");
const feedbackRouter = require("./Router/feedback");
const SearchRouter = require("./Router/SearchRouter");
const dashboarddataRouter = require("./Router/dashboarddataRouter");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
require("./model/db")
app.use(
  cors()
);

app.use("/search",SearchRouter);
app.use("/dashboard",dashboarddataRouter)

app.use("/chatgpt" , chatgptRouter);
app.use("/feedback" , feedbackRouter);


const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log("Server is running on port " + Port);
});


