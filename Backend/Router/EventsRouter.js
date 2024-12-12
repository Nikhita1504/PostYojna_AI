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

EventsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the event by ID and delete it
        const deletedEvent = await EventModel.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Route to get all events


module.exports = EventsRouter;

