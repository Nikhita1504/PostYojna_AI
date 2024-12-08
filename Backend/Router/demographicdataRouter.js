const express = require("express");
const axios = require("axios");
const { DemographicModel } = require("../model/db");

const demographicdataRouter = express.Router();

demographicdataRouter.get("/get", async (req, res) => {
    try {

        const { location } = req.query;
        console.log(location)

        const data = await DemographicModel.findOne({
            location: location
        })

        if(!data){
            console.log("no data found")
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching data ', error);
        res.status(500).send({ message: 'Internal server error' });
    }

})



module.exports = demographicdataRouter