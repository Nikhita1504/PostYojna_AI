const express = require("express");
const chatgptRouter = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { json } = require("body-parser");
const FeedbackModel = require("../model/db");

const genAI = new GoogleGenerativeAI("AIzaSyCn5UAt76WC7GZ--09qAzHd29mgz8G86TI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


chatgptRouter.post("/listen", async (req, res) => {
  const prompts = req.body;

  const prompt =JSON.stringify(prompts) ;
 
  const result = await model.generateContent(prompt);
 
  try {
  // Assuming the response is an object, you may need to access the content like this:
  if (result && result.response && result.response.text) {
    console.log(result.response.text());
    const res = result.response.text()
    const cleanJsonString = res.replace(/```json|\n```/g, '').trim();
      const r=JSON.parse(cleanJsonString);
    console.log(r);
if(r.relevant == true){

  const feedback = {
    location: prompts.location,         // Where the feedback was given
    scheme: prompts.scheme,             // Scheme the feedback is related to
    relevant: r.relevant,
    point: r.point
  };

  // Store feedback in the database
  const newFeedback = new FeedbackModel(feedback);
  await newFeedback.save();

}
  
  
    

  } else {
    console.log("No text found in the response.");
  }
} catch(error) {
  console.error("Error:", error.message);
}

}
)
module.exports = chatgptRouter;

