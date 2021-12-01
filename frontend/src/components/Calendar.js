import React, { useRef, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction'
import AddEventModal from './AddEventModal';
import Dashboard from "./dashboard/Dashboard";
import axios from "axios";
import moment from "moment";


export default function () {
    const [modalOpen, setModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const calendarRef = useRef(null);

    const onEventAdded = event => {
        let calendarApi = calendarRef.current.getApi()
        calendarApi.addEvent({
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            title: event.title
        });
    };


    async function handleEventAdd(data) {
        await axios.post('/api/calendar/create-event?', {title: data.event.title, start: data.event.start, end:data.event.end, username:localStorage.getItem("username")});
        console.log('works', data.event);
    }


    async function handleDatesSet(data) {
        const response = await axios.get("/api/calendar/get-events?start=" +moment(data.start).toISOString() +"&end="+moment(data.end).toISOString())
        let array = []
        for (let i = 0; i < response.data.length; i++) {
            if(response.data[i].username == localStorage.getItem("username")){
                array.push(response.data[i]);
            } 
        };
        setEvents(array);
    }


    return (
        <section>
            <button data-testid='add-event-button' onClick={() => setModalOpen(true)}>Add Event</button>
                <div style ={{position: "relative", zIndex: 0}}>
                    <FullCalendar
                        ref={calendarRef}
                        events={events}
                        plugins={[dayGridPlugin, interactionPlugin ]}
                        initialView="dayGridMonth"
                        selectable= 'true'
                        eventAdd={(event) => handleEventAdd(event)}
                        datesSet ={(date) => handleDatesSet(date)}
                        
  
                    />
                </div>

            <AddEventModal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            onEventAdded={event => onEventAdded(event)}
            />

        </section>
    )
}