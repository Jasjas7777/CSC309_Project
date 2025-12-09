import { Box, Paper, Typography } from "@mui/material";

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from "react-router-dom";

export default function ManagerLandingPage() {
    const navigate = useNavigate();

    const actions = [
        {
            label: "Manage Users",
            icon: <GroupsIcon sx={{ fontSize: 60, color:"#471396" }} />,
            path: "/manager/users"
        },
        {
            label: "Manage Events",
            icon: <EditCalendarIcon sx={{ fontSize: 60, color:"#471396" }} />,
            path: "/manager/events"
        },
        {
            label: "Manage Promotions",
            icon: <PriceChangeIcon sx={{ fontSize: 60, color:"#471396" }} />,
            path: "/manager/promotions"
        },
        {
            label: "Manage Transactions",
            icon: <EditDocumentIcon sx={{ fontSize: 60, color:"#471396" }} />,
            path: "/manager/transactions"
        },

    ];

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={5}
            gap={3}
        >
            <Typography variant="h4" fontWeight={700} color={"primary"}>
                Manager Dashboard
            </Typography>

            <Box
                display="flex"
                gap={4}
                flexWrap="wrap"
                justifyContent="center"
                mt={2}
            >
                {actions.map((item) => (
                    <Paper
                        key={item.label}
                        elevation={4}
                        onClick={() => navigate(item.path)}
                        sx={{
                            width: 220,
                            height: 180,
                            borderRadius: "20px",
                            display: "flex",
                            color:"#471396",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "0.2s",
                            ":hover": {
                                transform: "scale(1.05)",
                                boxShadow: 8,
                                backgroundColor: "#f5f0ff"
                            }
                        }}
                    >
                        {item.icon}
                        <Typography mt={1} fontSize="1.1rem" fontWeight={600}>
                            {item.label}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
