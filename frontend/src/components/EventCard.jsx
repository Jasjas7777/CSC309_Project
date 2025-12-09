import { Paper, Box, Typography, Button, IconButton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

export default function EventCard({event, manageMode = false, organizerMode = false,  onEdit, onViewAttendees, onDelete, onPublish, onReward}) {
    const navigate = useNavigate();

    const date = event.startTime
        ? new Date(event.startTime).toISOString().split("T")[0]
        : "N/A";

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 2,
                ml: -2,
                borderRadius: 2,
                backgroundColor: "#F7F1FF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "left",
                width: "100%",

                gap: {
                    xs: 2,
                    sm: 0
                }
            }}
        >
            {/* Left : Event Info */}
            <Box>
                <Typography fontWeight={700} textAlign="left">
                    {event.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" textAlign="left">
                    {event.description}
                </Typography>

                <Typography variant="body2" textAlign="left" sx={{mt: 1}}>
                    <strong>Time:</strong> {date} &nbsp;&nbsp;
                    <br/>
                    <strong>Location:</strong> {event.location}
                </Typography>
            </Box>

            {/* Right : Buttons */}
            <Box
                sx={{
                    width: "auto",
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                    gap: 1,
                    "@media (max-width: 600px)": {
                        maxWidth: "90px",
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                }}
            >
            {!manageMode && (
                /* Normal mode → Learn More button */
                <Button
                    variant="contained"
                    onClick={() => navigate(`/events/${event.id}`)}
                    sx={{
                        backgroundColor: "#E5D6FF",
                        color: "#5A2BBF",
                        fontWeight: 600,
                        borderRadius: "20px",
                        textTransform: "none",
                        px: 3,
                        "&:hover": { backgroundColor: "#D8C5FF" },
                        "@media (max-width: 600px)": {
                            px: 1,
                            width: 30
                        }
                    }}
                >
                    Learn More
                </Button>
            )}

            {manageMode && (
                /* Manage mode → Edit, Attendees, Delete */
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        ml: 2,
                        alignItems: "center",
                        width: {
                            xs: "100%",
                            sm: "auto"
                        },
                        justifyContent: {
                            xs: "flex-start",
                            sm: "flex-end"
                        },

                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        },


                    }}
                >
                    <IconButton onClick={() => onEdit?.(event.id)}>
                        <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => onViewAttendees?.(event.id)}>
                        <GroupIcon />
                    </IconButton>

                    <IconButton onClick={() => onReward?.(event.id)}>
                        <VolunteerActivismIcon />
                    </IconButton>


                    {!organizerMode && (
                        <IconButton onClick={() => onDelete?.(event.id)}>
                            <DeleteIcon />
                        </IconButton>
                    )}

                </Box>
            )}

            {manageMode && !event.published && (
                <Chip
                    label="Publish"
                    onClick={() => onPublish?.(event.id)}
                    clickable
                    sx={{
                        backgroundColor: "#B13BFF",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        borderRadius: "16px",
                        width: 300,
                        px: 1,
                        ml: 2.77,
                        "&:hover": {
                            backgroundColor: "#471396"
                        },
                    }}
                />
            )}

            {manageMode && event.published && (
                <Chip
                    label="Published"
                    color="secondary"
                    icon={<CheckCircleOutlineIcon />}
                    sx={{
                        fontWeight: 600,
                        mb: 1
                    }}
                />
            )}
            </Box>

        </Paper>
    );
}

