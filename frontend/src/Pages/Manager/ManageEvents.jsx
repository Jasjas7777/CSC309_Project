import {Box, Typography, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider, Paper,} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { useState, useEffect, useRef } from "react";
import {getEventList, updateEvent, getEvent, deleteEvent, addOrganizer, removeOrganizer, addGuest, removeGuest, createEvent,createEventReward} from "@/api/apiConfig.js"
import EventCard from "@/components/EventCard";
import CreateEventDialog from "@/components/CreateEventDialog.jsx";
import EditEventDialog from "@/components/EditEventDialog";
import ManageGuestsDialog from "@/components/ManageGuestsDialog.jsx";
import RewardDialog from "@/components/RewardDialog.jsx";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {enqueueSnackbar} from "notistack";


export default function ManageEvents() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("earliest");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    const [editOpen, setEditOpen] = useState(false);
    const [attendeeOpen, setAttendeeOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [rewardOpen, setRewardOpen] = useState(false);


    // attendees
    const [attendees, setAttendees] = useState([]);
    const [attendeePage, setAttendeePage] = useState(1);
    const [attendeeHasMore, setAttendeeHasMore] = useState(true);
    const loaderRef = useRef(null);

    //Create event
    const [createOpen, setCreateOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        startTime: null,
        endTime: null,
        location: "",
        capacity: "",
        points: "",
    });

    // Reset pagination when search changes
    useEffect(() => {
        setPage(1);
    }, [search]);

    const handleCreateEvent = async () => {
        try {

            if (!newEvent.name || !newEvent.points || !newEvent.location || !newEvent.description || !newEvent.startTime || !newEvent.endTime) {
                enqueueSnackbar("Please fill all required fields", { variant: "error" });
                return;
            }

            const payload = {
                name: newEvent.name,
                description: newEvent.description,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                capacity: newEvent.capacity ? Number(newEvent.capacity) : null,
                location: newEvent.location,
                points: newEvent.points,
            };
            await createEvent(payload);

            setCreateOpen(false);

            // Reset fields
            setNewEvent({
                name: "",
                description: "",
                startTime: null,
                endTime: null,
                location: "",
                capacity: "",
                points: "",
            });

            // Reload page
            load();
            setPage(1);

        } catch (err) {
            console.error("Failed to create event:", err);
        }
    };


    // -----------------------------------
    // LOAD EVENTS
    // -----------------------------------
    async function load() {
        try {
            const res = await getEventList({
                name: search || undefined,
                page: search ? 1 : page,     // search → always fetch page 1
                limit: search ? 9999 : 10,   // search → get all matched events
            });

            let list = res.data.results;

            // Sorting only when NO search
            if (!search) {
                if (sort === "earliest") {
                    list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                } else {
                    list.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                }
            }

            setEvents(list);
            setCount(res.data.count);

        } catch (err) {
            console.error("Failed to load events", err);
        }
    }

    useEffect(() => {
        load();
    }, [search, sort, page]);



    // -----------------------------------
    // open edit dialog
    // -----------------------------------
    const openEditDialog = async (eventId) => {
        try {
            const res = await getEvent(eventId);
            setSelectedEvent(res.data);
            setEditOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const saveEventEdit = async () => {
        try {
            await updateEvent(selectedEvent.id, {
                name: selectedEvent.name,
                description: selectedEvent.description,
                location: selectedEvent.location,
                points: selectedEvent.points,
                capacity: selectedEvent.capacity,
                startTime: selectedEvent.startTime,
                endTime: selectedEvent.endTime,
            });
            setEditOpen(false);
            load();
            setPage(1);
        } catch (err) {
            console.error(err);
        }
    };

    // -----------------------------------
    // delete event
    // -----------------------------------
    const handleDelete = async (eventId) => {
        try {
            await deleteEvent(eventId);
            load();
            setPage(1);
        } catch (err) {
            console.error(err);
        }
    };

    // -----------------------------------
    // attendees modal
    // -----------------------------------
    const openAttendeesDialog = async (eventId) => {
        try {
            const res = await getEvent(eventId);
            setSelectedEvent(res.data);
            setAttendeeOpen(true);   // Dialog opens
        } catch (err) {
            console.error(err);
        }
    };


    // infinite scroll attendees
    useEffect(() => {
        if (!attendeeOpen) return;

        async function loadAttendees() {
            const all = selectedEvent?.guests || [];
            const start = (attendeePage - 1) * 20;
            const end = start + 20;

            const chunk = all.slice(start, end);

            setAttendees((prev) => [...prev, ...chunk]);

            if (chunk.length < 20) setAttendeeHasMore(false);
        }

        loadAttendees();
    }, [attendeePage, attendeeOpen]);

    useEffect(() => {
        if (!attendeeOpen || !loaderRef.current) return;

        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && attendeeHasMore) {
                setAttendeePage((p) => p + 1);
            }
        });

        obs.observe(loaderRef.current);
        return () => obs.disconnect();
    }, [attendeeHasMore, attendeeOpen]);



    const demoteOrganizer = async (userId) => {
        try {
            await removeOrganizer(selectedEvent.id, userId);
            const updated = await getEvent(selectedEvent.id);
            setSelectedEvent(updated.data);
            enqueueSnackbar("Remove organizer successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    };

    const removeGuestFromEvent = async (userId) => {
        try {
            await removeGuest(selectedEvent.id, userId);
            const updated = await getEvent(selectedEvent.id);
            setSelectedEvent(updated.data);
            enqueueSnackbar("Remove guest successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    };

    const addGuestToEvent = async (utorid) => {
        try {
            await addGuest(selectedEvent.id, utorid);

            // Refresh event after updating guests
            const updated = await getEvent(selectedEvent.id);
            setSelectedEvent(updated.data);
            enqueueSnackbar("Add guest successfully!", { variant: "success" });
        } catch (err) {
            console.error("Failed to add guest:", err);
        }
    };

    const addOrganizerToEvent = async (utorid) => {
        try {
            await addOrganizer(selectedEvent.id, utorid);

            // Refresh the event so the dialog updates
            const updated = await getEvent(selectedEvent.id);
            setSelectedEvent(updated.data);
            enqueueSnackbar("Add organizer successfully!", { variant: "success" });
        } catch (err) {
            console.error("Failed to add organizer:", err);
        }
    };



    async function handlePublish(eventId) {
        try {
            await updateEvent(eventId, { published: true });
            load();
            enqueueSnackbar("Publish successfully!", { variant: "success" });

        } catch (err) {
            console.error("Failed to publish event", err);
        }
    }

    const openRewardDialog = async (eventId) => {
        try {
            const res = await getEvent(eventId);
            setSelectedEvent(res.data);
            setRewardOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const awardPointsToEvent = async (data) => {
        try {
            await createEventReward(selectedEvent.id, data);
            const updated = await getEvent(selectedEvent.id);
            setSelectedEvent(updated.data);
            enqueueSnackbar("Award guest successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div>
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                <Button
                    startIcon={<ArrowBackIosNewIcon />}
                    onClick={() => navigate("/manager/dashboard")}
                    sx={{
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#471396",
                        mt: 1,
                        mr: 1,
                        borderBottom: "2px solid #471396",
                        borderRadius: 0,
                        paddingBottom: "4px",
                        "&:hover": {
                            backgroundColor: "rgba(71,19,150,0.06)"
                        }
                    }}
                >
                    Back to Cashier Dashboard
                </Button>
            </Box>
            <Paper elevation={1} sx={{
                p: 4,
                borderRadius: 3,
                mt: 5,
                width: "85%",
                mx: "auto",
            }}>
                <Box p={3}>
                    <Box display="flex"
                         justifyContent="space-between"
                         paddingBottom={2}
                         sx={{
                             flexDirection: {
                                 xs: "column",
                                 sm: "row"
                             },
                         }}
                    >
                        <Box><Typography variant="h5" fontWeight={700} color="primary">Manage Events</Typography>
                            <Typography variant="body2" mb={2}>Create and manage events</Typography>
                        </Box>
                        <Button variant="contained" onClick={() => setCreateOpen(true)}
                                sx={{
                                    whiteSpace: "nowrap",

                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                    height: { xs: 32, sm: 40 },
                                    padding: { xs: "0 12px", sm: "0 20px" },
                                    minWidth: { xs: "auto", sm: "100px" },
                                }}>
                            Add New Event
                        </Button>
                    </Box>

                    {/* CREATE EVENT DIALOG */}
                    <CreateEventDialog
                        open={createOpen}
                        onClose={() => setCreateOpen(false)}
                        newEvent={newEvent}
                        setNewEvent={setNewEvent}
                        onSave={handleCreateEvent}
                    />


                    {/* Search + Sort */}
                    <Box display="flex" gap={2} mb={3}>
                        <TextField
                            placeholder="Search events..."
                            size="small"
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <TextField
                            select
                            size="small"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            disabled={Boolean(search)}    // 🔥 disable sorting during search
                        >
                            <MenuItem value="earliest">Earliest First</MenuItem>
                            <MenuItem value="latest">Latest First</MenuItem>
                        </TextField>

                    </Box>

                    {/* Event List */}
                    {events.map((event) => (
                        <EventCard
                            event={event}
                            manageMode
                            onEdit={openEditDialog}
                            onViewAttendees={openAttendeesDialog}
                            onDelete={handleDelete}
                            onPublish={handlePublish}
                            onReward={openRewardDialog}
                        />
                    ))}


                    {/* EDIT EVENT DIALOG */}
                    <EditEventDialog
                        open={editOpen}
                        onClose={() => setEditOpen(false)}
                        selectedEvent={selectedEvent}
                        setSelectedEvent={setSelectedEvent}
                        onSave={saveEventEdit}
                    />


                    {/* MANAGE ATTENDEES */}
                    <ManageGuestsDialog
                        attendeeOpen={attendeeOpen}
                        setAttendeeOpen={setAttendeeOpen}
                        selectedEvent={selectedEvent}

                        addGuestToEvent={addGuestToEvent}
                        addOrganizerToEvent={addOrganizerToEvent}

                        demoteOrganizer={demoteOrganizer}
                        removeGuestFromEvent={removeGuestFromEvent}
                    />

                    <RewardDialog
                        open={rewardOpen}
                        onClose={() => setRewardOpen(false)}
                        selectedEvent={selectedEvent}
                        awardPointsToEvent={awardPointsToEvent}
                    />


                </Box>
            </Paper>
        </div>

    );
}
