import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Calendar.module.css'; // Import your CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [isEventListView, setIsEventListView] = useState(false); // Manage view toggle
    const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
    const [eventTitle, setEventTitle] = useState(""); // Store event title
    const [eventDescription, setEventDescription] = useState(""); // Store event description
    const [fromDate, setFromDate] = useState(""); // Store start date
    const [toDate, setToDate] = useState(""); // Store end date

    // Fetch events from the backend when the component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:3000/events');
                const data = await response.json();
                setEvents(data); // Set events in state
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []); // Empty dependency array to run once when the component mounts

    const handleAddEvent = async () => {
        const newEvent = {
            title: eventTitle,
            description: eventDescription,
            start: new Date(fromDate).toISOString(),  // Convert to ISO string
            end: new Date(toDate).toISOString(),      // Convert to ISO string
        };
        console.log(newEvent);
    
        try {
            // POST request to add event to the database using axios
            const response = await axios.post('http://localhost:3000/events/add', newEvent

        );
    
            // Check if the response is successful
            if (response.status === 201) {
                setEvents((prevEvents) => [...prevEvents, newEvent]); // Update state with the new event
                setIsModalOpen(false); // Close modal
                setEventTitle(""); // Reset input fields
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

    const toggleView = () => {
        setIsEventListView(!isEventListView); // Toggle between calendar and event list
    };

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.imageWrapper}>
                <img src="/assets/bg.png" alt="Background" />
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
                          {events.map((event, index) => (
                            <li key={index} className={styles.eventItem}>
                              <strong className={styles.eventTitle}>{event.title}</strong>
                              <p className={styles.eventDescription}>{event.description}</p>
                              <p className={styles.eventTime}>
                                {`From: ${moment(event.start).format("MMMM Do YYYY, h:mm:ss a")}`}
                              </p>
                              <p className={styles.eventTime}>
                                {`To: ${moment(event.end).format("MMMM Do YYYY, h:mm:ss a")}`}
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
        </div>
    );
};

export default CalendarComponent;
