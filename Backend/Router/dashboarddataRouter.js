const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const { DashboardModel, AgeGroup } = require('../model/db'); // Path to your model file


const dashboarddataRouter = express.Router();


dashboarddataRouter.get('/getData', async (req, res) => {
    try {

        const {  scheme } = req.query;
        // console.log("hello")
        const data = await DashboardModel.findOne({

            'schemeName': scheme // Case-insensitive match
        });


        if (!data) {
            return res.status(404).json({ message: "No data found for the given city and scheme" });
        }
        // console.log(data.data);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Server Error" });
    }
});




module.exports = dashboarddataRouter;

