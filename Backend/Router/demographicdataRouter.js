const express = require("express");
const axios = require("axios");
const { DemographicModel, Population, AgeGroup, Region } = require("../model/db");

const demographicdataRouter = express.Router();

// demographicdataRouter.get("/get", async (req, res) => {
//     try {

//         const { location } = req.query;
//         console.log(location)

//         const data = await DemographicModel.findOne({
//             location: location
//         })

//         if(!data){
//             console.log("no data found")
//         }

//         res.json(data);
//     } catch (error) {
//         console.error('Error fetching data ', error);
//         res.status(500).send({ message: 'Internal server error' });
//     }

// })

demographicdataRouter.get("/getPopulationData", async (req, res) => {
    try {
        const { Location } = req.query;
        const data = await Population.findOne({ Location: Location });
        if (!data) {
            res.json({ message: "No data found for this location" })
        }
        res.status(201).json(data);

    } catch (error) {
        console.log(error);
    }
})

demographicdataRouter.get("/getAgedata", async (req, res) => {
    try {
        const data = await AgeGroup.find({});
        console.log(data);
        res.json(data);

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Server Error" });

    }
})
demographicdataRouter.get("/getdemographicData", async (req, res) => {
    try {
        const { Location } = req.query;
        const data = await Region.findOne({region_name:Location});
        res.json(data);
    } catch (error) {
        console.log(error)
    }

})


module.exports = demographicdataRouter