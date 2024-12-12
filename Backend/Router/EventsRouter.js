const express = require('express');

const EventsRouter = express.Router();
const { EventModel } = require('../model/db');

// Route to get all events
EventsRouter.get('/', async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
});

// Route to add an event
EventsRouter.post('/add', async (req, res) => {
    try {
        const { title, description, start, end } = req.body;

        // Validate required fields
        if (!title || !description || !start || !end) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate date formats
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
            return res.status(400).json({ message: 'Invalid date range' });
        }

        const newEvent = new EventModel(req.body);
        await newEvent.save();

        res.status(201).json({ message: 'Event added successfully!', event: newEvent });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Error adding event', error: error.message });
    }
});

// Route to delete an event by ID
EventsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        console.log("Deleting event with ID:", id);
        const deletedEvent = await EventModel.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
});

// Route to update an event by ID
EventsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        console.log("Updating event with ID:", id, "Data:", updateData);
        const updatedEvent = await EventModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully', updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
});

module.exports = EventsRouter;