const express = require("express");
const { RegionModel } = require("../model/db");
const AddnewlocationDataRouter = express.Router();

AddnewlocationDataRouter.post('/regions', async (req, res) => {
  try {
    console.log("heelo")
    console.log(req.body)
    const newRegion = new RegionModel(req.body);
    console.log("new",newRegion);
 
      await newRegion.save();
   
   
   console.log("h")
    res.status(201).json({successfull:true, message: 'Region created successfully', newRegion });
  } catch (error) {
    res.status(400).json({ successfull:false,error: error.message });
  }
});

module.exports=  AddnewlocationDataRouter;