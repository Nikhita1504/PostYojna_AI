import React, { useState } from 'react';
import styles from "./Calendar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faTrash } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar'; // Make sure to import the calendar component
import 'react-calendar/dist/Calendar.css'; // Import the CSS file for the calendar

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    date: '',
    title: '',
    description: '',
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setEventDetails({ ...eventDetails, date: newDate });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddEvent = () => {
    setEventList([
      ...eventList,
      {
        ...eventDetails,
        date: eventDetails.date.toLocaleDateString(),
      }
    ]);
    setShowModal(false);
  };

  const handleDeleteEvent = (index) => {
    const updatedList = eventList.filter((_, i) => i !== index);
    setEventList(updatedList);
  };

  return (
    <>
      <div className={styles.CalendarContainer}>
        <div className={styles.imageWrapper}>
          <img src="/assets/bg.png" alt="Background" />
        </div>
        <div className={styles.header}>
          <p>Calendar</p>
          <div>
            <button className={styles.addBtn} onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} /> Add Event
            </button>
            <button className={styles.addBtn}>
              <FontAwesomeIcon icon={faList} /> Events List
            </button>
          </div>
        </div>

        {/* Ensure the calendar is inside a container that is visible */}
        <div className={styles.calendarContainer}>
          <Calendar onChange={handleDateChange} value={date} />
        </div>

        {/* Event Modal */}
        {showModal && (
          <div className={styles.modal}>
            <h3>Add Event</h3>
            <input
              type="date"
              value={eventDetails.date.toLocaleDateString('en-CA')}
              onChange={(e) => setEventDetails({ ...eventDetails, date: new Date(e.target.value) })}
            />
            <input
              type="text"
              placeholder="Title"
              value={eventDetails.title}
              onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={eventDetails.description}
              onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
            />
            <button onClick={handleAddEvent}>Save Event</button>
            <button onClick={handleModalClose}>Close</button>
          </div>
        )}

        {/* Events List */}
        <div className={styles.eventList}>
          {eventList.map((event, index) => (
            <div key={index} className={styles.eventItem}>
              <p>{event.date} - {event.title}</p>
              <button onClick={() => handleDeleteEvent(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CalendarComponent;
