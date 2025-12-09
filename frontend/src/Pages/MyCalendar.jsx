import {useNavigate} from "react-router-dom";
import { useEffect, useState} from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "@/api/apiConfig.js";
import { Box, Typography, Paper, Button } from "@mui/material";

export default function MyCalendar() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadEvents() {
            try {
                const res = await api.get("/api/google/calendars", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                // Convert Google events → FullCalendar format
                const formatted = res.data.map(e => ({
                    id: e.id,
                    title: e.summary,
                    start: e.start?.dateTime || e.start?.date,
                    end: e.end?.dateTime || e.end?.date,
                }));

                setEvents(formatted);
            } catch (err) {
                console.error("Failed to load events", err);
            }
        }

        loadEvents();
    }, []);

    return (
        <Box sx={{ maxWidth: "900px", mx: "auto", mt: 5 }}>

            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ width: "150px" }} />
                <Typography variant="h4" textAlign="center" fontWeight={700} mb={3} sx={{ flexGrow: 1 }}>
                    My Google Calendar
                </Typography>
                {/* Back Button */}
                <Button
                    variant="contained"
                    onClick={() => navigate("/events")}
                    sx={{
                        alignItems:"right",
                        mb: 2,
                        backgroundColor: "#5A2BBF",
                        color: "white",
                        textTransform: "none",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#471396" }
                    }}
                >
                    ← Back to Events
                </Button>

            </Box>


            <Paper sx={{ p: 2 }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }}
                    events={events}
                    height="80vh"
                />
            </Paper>
        </Box>
    );

}

