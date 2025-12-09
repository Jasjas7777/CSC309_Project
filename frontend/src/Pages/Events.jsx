import { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    Pagination,
    Box,
    Button
} from "@mui/material";
import EventCard from "../components/EventCard.jsx";
import { getEventList } from "../api/apiConfig.js";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import api from "@/api/apiConfig.js"

export default function Events() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);


    const limit = 5;

    const fetchEvents = async () => {
        try {
            const res = await getEventList(
                 {
                    page,
                    limit,
                }
            );

            const now = new Date();
            const filtered = res.data.results.filter((event) => {
                if (!event.endTime) {
                    return true;
                }

                const end = new Date(event.endTime);
                return end > now;
            });

            setEvents(filtered);
            setCount(filtered.length);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [page]);

    return (
        <Paper
            sx={{
                p: 4,
                mt: 5,
                borderRadius: 3,
                maxWidth: 900,
                mx: "auto",
            }}
        >
            {/* Title */}
            <Box display="flex" justifyContent="space-between" alignItems="center" textAlign="left">
                <Typography
                    variant="h5"
                    align="center"
                    fontWeight={700}
                    sx={{ color: "#5A2BBF" }}
                >
                    Upcoming Events
                </Typography>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#E5D6FF",
                        color: "#5A2BBF",
                        borderRadius: "20px",
                        textTransform: "none",
                        px: 2,
                        alignItems: "center",
                        display: "flex",
                        gap: 1,
                        "&:hover": { backgroundColor: "#D8C5FF" },
                        "@media (max-width: 600px)": {
                            px: 1,
                        }
                    }}
                    onClick={() => window.location.href = "http://localhost:3000/api/google/"}

                >
                    <Box sx={{ display: { xs: "none", md: "block" }, mt:1 }}>
                        <CalendarMonthIcon />
                    </Box>
                    See My Calendar
                </Button>
            </Box>

            {/* List */}
            <Box mt={3} p={2}>
                {events.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                        No events found.
                    </Typography>
                ) : (
                    events.map((ev) => <EventCard key={ev.id} event={ev} />)
                )}
            </Box>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={1}>
                <Pagination
                    page={page}
                    count={Math.ceil(count / limit)}
                    onChange={(e, value) => setPage(value)}
                    sx={{ button: { color: "#5A2BBF" } }}
                />
            </Box>
        </Paper>
    );
}
