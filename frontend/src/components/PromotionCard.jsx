import {Paper, Box, Typography, IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PromotionCard({promo, manageMode=false, onEdit, onDelete}) {
    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                borderRadius: 2,
                mb: 2,
                backgroundColor: "#F4EEFF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {/* Left Side: Title + description */}
            <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1,  justifyContent: "space-between", alignItems: "center"}}>
            <Box>
                <Typography fontWeight={700} textAlign={"left"}>#{promo.id} {promo.name}</Typography>
                <Typography variant="body2" color="text.secondary" textAlign={"left"}>
                    {promo.description}
                </Typography>
            </Box>

            {/* Right Side: Valid date */}
            <Typography fontWeight={600} textAlign="right" sx={{ color: "#5A2BBF" }}>
                Valid Until: {promo.endTime ? new Date(promo.endTime).toISOString().split("T")[0] : "N/A"}
            </Typography>
            </Box>

            {manageMode && (
                /* Manage mode → Edit, Attendees, Delete */
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        ml: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        },
                    }}
                >
                    <IconButton onClick={() => onEdit?.(promo.id)}>
                        <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => onDelete?.(promo.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}
        </Paper>
    );
}