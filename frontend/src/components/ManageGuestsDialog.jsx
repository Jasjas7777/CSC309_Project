import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    TextField,
    Paper,
    Button,
    Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { getUser } from "@/api/apiConfig";

export default function ManageGuestsDialog({
                                               attendeeOpen,
                                               setAttendeeOpen,
                                               selectedEvent,
                                               addGuestToEvent,
                                               addOrganizerToEvent,
                                               removeGuestFromEvent,
                                               demoteOrganizer,
                                               organizerMode = false
                                           }) {

    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    /** Reset when dialog opens */
    useEffect(() => {
        if (attendeeOpen) {
            setSearchInput("");
            setSearchResults([]);
        }
    }, [attendeeOpen]);

    async function handleSearch(e) {
        const query = e.target.value.trim();
        setSearchInput(query);

        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await getUser(query);
            setSearchResults([res.data]);
        } catch (err) {
            // Not found → clear results
            setSearchResults([]);
        }
    }


    return (
        <Dialog open={attendeeOpen} onClose={() => setAttendeeOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: 700 }}>
                Event Attendees – {selectedEvent?.name}
                <IconButton sx={{ position: "absolute", right: 16, top: 16 }} onClick={() => setAttendeeOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>

                {/* Attendee Count Box */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: "#eef2ff", borderRadius: 2 }}>
                    <Typography fontWeight={600}>
                        Attendees: {selectedEvent?.guests?.length} / {selectedEvent?.capacity || "∞"}
                    </Typography>
                </Paper>

                {/* Add User Section */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Typography fontWeight={600} mb={1}>Add User to Event</Typography>

                    <Typography variant="body2" mb={1}>Search Users</Typography>

                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by name, email, or ID..."
                        value={searchInput}
                        onChange={handleSearch}
                    />

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <Box mt={2}>
                            {searchResults.map((user) => (
                                <Paper
                                    key={user.id}
                                    sx={{ p: 2, mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                >
                                    <Box>
                                        <Typography fontWeight={600}>{user.name}</Typography>
                                        <Typography variant="body2">{user.email}</Typography>
                                    </Box>

                                    <Box display="flex" gap={1}>
                                        {!organizerMode && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => addOrganizerToEvent(user.utorid)}
                                            >
                                                Add as Organizer
                                            </Button>
                                        )}

                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => addGuestToEvent(user.utorid)}
                                        >
                                            Add as Attendee
                                        </Button>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}

                </Paper>

                {/* Organizers List */}
                <Typography fontWeight={700} mb={1}>
                    Event Organizers{" "}
                    <Chip label={selectedEvent?.organizers?.length || 0} size="small" />
                </Typography>

                {selectedEvent?.organizers?.map((user) => (
                    <Paper
                        key={user.id}
                        sx={{
                            p: 2,
                            mb: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "#f7f3ff"
                        }}
                    >
                        <Box>
                            <Chip
                                label="Organizer"
                                color="primary"
                                size="small"
                                sx={{ mb: 0.5 }}
                            />
                            <Typography fontWeight={600}>{user.name}</Typography>
                            <Typography variant="body2">{user.email}</Typography>
                        </Box>

                        {!organizerMode && (
                            <IconButton onClick={() => demoteOrganizer(user.id)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Paper>
                ))}

                {/* Attendees List */}
                <Typography fontWeight={700} mt={3} mb={1}>
                    Regular Attendees{" "}
                    <Chip label={selectedEvent?.guests?.length || 0} size="small" />
                </Typography>

                {selectedEvent?.guests?.map((user) => (
                    <Paper
                        key={user.id}
                        sx={{
                            p: 2,
                            mb: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <Box>
                            <Typography fontWeight={600}>{user.name}</Typography>
                            <Typography variant="body2">{user.email}</Typography>
                        </Box>

                        {!organizerMode && (
                            <IconButton onClick={() => demoteOrganizer(user.id)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Paper>
                ))}

            </DialogContent>
        </Dialog>
    );
}
