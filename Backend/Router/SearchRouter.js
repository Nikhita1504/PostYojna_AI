const express = require("express");
const{ default:axios} = require("axios");


const SearchRouter = express.Router();
SearchRouter.get('/location', async (req, res) => {
    const query = req.query.query;  // Place to search for
    console.log(query)

    if (!query) {
        return res.status(400).send({ message: 'Query parameter is required' });
    }
  
    try {
        // Making a request to the Nominatim API to search for the place
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1,
                countrycodes: 'IN', // Restrict to India (you can modify this as needed)
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Nominatim:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
    
  });

module.exports=SearchRouter

  