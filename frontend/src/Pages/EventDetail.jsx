import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Paper, Typography, Box, Button, Divider,} from "@mui/material";
import { getEvent, joinEvent, quitEvent } from "../api/apiConfig.js";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventPhoto from "../assets/event.jpg";
import { useAuth } from "../context/AuthContext";
import {enqueueSnackbar} from "notistack";


export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [joined, setJoined] = useState(false);
    const { user } = useAuth();


    async function fetchEvent() {
        try {
            const res = await getEvent(parseInt(id));
            setEvent(res.data);
        } catch (err) {
            console.error("Failed to load event:", err);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [id]);

    function formatEventTime(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const formattedDate = startDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const formatTime = (d) =>
            d.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).replace(" ", "");

        const startTime = formatTime(startDate);
        const endTime = formatTime(endDate);

        return `${startTime} – ${endTime} • ${formattedDate}`;
    }

    async function handleRSVP() {
        try {
            await joinEvent(event.id);
            await fetchEvent();
            setJoined(true);
            enqueueSnackbar("RSVP successfully!", { variant: "success" });
        } catch (err) {
            if (err.response?.data?.error === "User is already a guest") {
                setJoined(true);
                await fetchEvent();
            } else {
                return
            }
        }
    }


    async function handleUndoRSVP() {
        try {
            await quitEvent(event.id);
            await fetchEvent();
            setJoined(false);
            enqueueSnackbar("Undo RSVP successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (event && user) {
            const isGuest = event.guests?.some(g => g.id === user.id);
            setJoined(isGuest);
        }
    }, [event, user]);

    if (!event) return null;
    const organizerNames = event.organizers?.map(o => o.name).join(", ") || "N/A";


    return (
        <Paper sx={{borderRadius: 3, overflow: "hidden" }}>

            {/* Photo */}
            <img
                src={EventPhoto}
                alt="Event Photo"
                style={{ width: "100%", height: 300, objectFit: "cover" }}
            />

            {/* Details */}
            <Box sx={{ p: 4 }} >
                {/* Name + Calendar Button */}
                <Box display="flex" justifyContent="space-between" >
                    <Typography variant="h5" fontWeight={700}>
                        {event.name}
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#E5D6FF",
                            color: "#5A2BBF",
                            textTransform: "none",
                            borderRadius: "20px",
                            px: 2,
                            alignItems: "center",
                            display: "flex",
                            gap: 1,
                            "&:hover": { backgroundColor: "#D8C5FF" },
                        }}
                        onClick={() => window.location.href = "http://localhost:3000/api/google/"}
                    >
                        <Box sx={{ display: { xs: "none", md: "block"}, mt:1 }}>
                            <CalendarMonthIcon />
                        </Box>
                        See My Calendar
                    </Button>
                </Box>

                {/* Information */}
                <Box mt={3}>
                    {/* Organizer */}
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                        <Typography fontWeight={600}>Organizers:</Typography>
                        <Typography>{organizerNames}</Typography>
                    </Box>

                    {/* Location */}
                    <Box display="flex" flexDirection="row" alignItems="center" mt={2} gap={1}>
                        <Typography fontWeight={600}>Location:</Typography>
                        <Typography>{event.location}</Typography>
                    </Box>


                    {/* Time and Date */}
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1} mt={2}>
                        <Typography fontWeight={600}>Time and Date</Typography>
                        <Typography>{formatEventTime(event.startTime, event.endTime)}</Typography>
                    </Box>

                    {/* Spots */}
                    <Box display="flex" alignItems="center" mt={2} gap={1}>
                        <Typography fontWeight={600}>Spot Remain:</Typography>
                        <Box
                            sx={{
                                px: 1.4,
                                py: 0.3,
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                bgcolor: "#471396",
                                color: "#fff",
                            }}
                        >
                            {event.capacity === null
                                ? "Unlimited"
                                : `${event.capacity - event.numGuests}/${event.capacity}`}
                        </Box>
                    </Box>

                </Box>


                {/* Buttons */}
                <Box mt={4} display="flex" gap={2}>
                    <Button
                        onClick={joined ? handleUndoRSVP : handleRSVP}
                        variant={joined ? "outlined" : "contained"}
                        sx={{
                            backgroundColor: joined ? "transparent" : "#E5D6FF",
                            color: "#5A2BBF",
                            borderRadius: "20px",
                            px: 4,
                            borderColor: "#5A2BBF",
                            "&:hover": {
                                backgroundColor: joined ? "#F0E6FF" : "#D8C5FF"
                            }
                        }}
                    >
                        {joined ? "Undo RSVP" : "RSVP"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        sx={{
                            borderRadius: "20px",
                            px: 4,
                            textTransform: "none",
                        }}
                    >
                        Back
                    </Button>
                </Box>


            </Box>

        </Paper>
    );
}
