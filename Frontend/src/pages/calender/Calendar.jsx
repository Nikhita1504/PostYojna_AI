import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Calendar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [isEventListView, setIsEventListView] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Manage delete modal
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [eventToDelete, setEventToDelete] = useState(null); // Store event to be deleted

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleAddEvent = async () => {
        const newEvent = {
            title: eventTitle,
            description: eventDescription,
            start: new Date(fromDate).toISOString(),
            end: new Date(toDate).toISOString(),
        };

        try {
            const response = await axios.post('http://localhost:3000/events/add', newEvent);
            if (response.status === 201) {
                setEvents((prevEvents) => [...prevEvents, newEvent]);
                setIsModalOpen(false);
                setEventTitle("");
                setEventDescription("");
                setFromDate("");
                setToDate("");
            } else {
                console.error('Error adding event:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        console.log(eventToDelete)

        try {
            const response = await axios.delete(`http://localhost:3000/events/${eventToDelete._id}`);
            if (response.status === 200) {
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== eventToDelete.id)
                );
                setIsDeleteModalOpen(false);
                setEventToDelete(null);
            } else {
                console.error('Error deleting event:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const toggleView = () => {
        setIsEventListView(!isEventListView);
    };

    const openDeleteModal = (event) => {
        setEventToDelete(event); // Set the event to delete
        setIsDeleteModalOpen(true); // Show the delete modal
    };

    return (
        <div className={styles.bigCon}>
            <div className={styles.calendarContainer}>
            <div className={styles.imageWrapper}>
                <img src="/assets/fullbanner.png" alt="Background" />
            </div>
            <div className={styles.header}>
                <p>Calendar</p>
                <div className={styles.headerBtns}>
                    <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Add Event
                    </button>

                    <button className={styles.addBtn} onClick={toggleView}>
                        <FontAwesomeIcon icon={faList} /> {isEventListView ? 'Calendar' : 'Events List'}
                    </button>
                </div>
            </div>

            <div className={styles.calendarBox}>
                <div className={styles.calendarWrapper}>
                    {isEventListView ? (
                        <div className={styles.eventList}>
                            <h2>Event List</h2>
                            <ul>
                                {events.map((event) => (
                                    <li
                                        key={event.id}
                                        className={styles.eventItem}
                                        onClick={() => openDeleteModal(event)}
                                    >
                                        <strong className={styles.eventTitle}>{event.title}</strong>
                                        <p className={styles.eventDescription}>{event.description}</p>
                                        <p className={styles.eventTime}>
                                            From: {moment(event.start).format("MMMM Do YYYY, h:mm:ss a")}
                                        </p>
                                        <p className={styles.eventTime}>
                                            To: {moment(event.end).format("MMMM Do YYYY, h:mm:ss a")}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            selectable
                            onSelectEvent={openDeleteModal} // Open delete modal on event click
                        />
                    )}
                </div>
            </div>

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2>Add Event</h2>
                        <input
                            type="text"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="Enter event title"
                            className={styles.input}
                        />
                        <textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="Enter event description"
                            className={styles.input}
                            rows="4"
                        />
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.buttonGroup}>
                            <button onClick={handleAddEvent} className={styles.button}>
                                Add Event
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Event Modal */}
            {isDeleteModalOpen && eventToDelete && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>

                        <p>Are you sure you want to delete this event?</p>
                        <p><strong>{eventToDelete.title}</strong></p>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleDeleteEvent} className={styles.button}>
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default CalendarComponent;
