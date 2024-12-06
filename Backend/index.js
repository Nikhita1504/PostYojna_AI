
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

app.get('/search', async (req, res) => {
  const query = req.query.query;  // Place to search for

  if (!query) {
      return res.status(400).send({ message: 'Query parameter is required' });
  }

  try {
      // Making a request to the Nominatim API to search for the place
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
              q: query,
              format: 'json',
              addressdetails: 1,
              countrycodes: 'IN', // Restrict to India (you can modify this as needed)
          },
      });
      console.log(response.data);
      // Send the results back to the frontend
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching data from Nominatim:', error);
      res.status(500).send({ message: 'Internal server error' });
  }
});



const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log("Server is running on port " + Port);
});

