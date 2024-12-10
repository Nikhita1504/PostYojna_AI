const express = require('express');

const EventsRouter = express.Router();
const {EventModel} = require('../model/db');



EventsRouter.get('/', async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
});

// Route to add an event
EventsRouter.post('/add', async (req, res) => {
    console.log("hello")
    console.log(req.body)
    try {
        const newEvent = new EventModel(req.body);
        console.log("world");
        console.log("NewEvnent " , newEvent)
        await newEvent.save();
        res.status(201).json({ message: 'Event added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding event', error: error.message });
    }
});

// Route to get all events


module.exports = EventsRouter;

