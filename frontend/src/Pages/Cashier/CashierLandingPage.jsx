import { Box, Paper, Typography } from "@mui/material";

import AddBoxIcon from '@mui/icons-material/AddBox';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from "react-router-dom";

export default function CashierLandingPage() {
    const navigate = useNavigate();

    const actions = [
        {
            label: "Process Redemption",
            icon: <VerifiedIcon sx={{ fontSize: 60, color:"#471396"}} />,
            path: "/cashier/redeem"
        },
        {
            label: "Create Transaction",
            icon: <AddBoxIcon sx={{ fontSize: 60, color:"#471396" }} />,
            path: "/cashier/create"
        },
        {
            label: "Register New User",
            icon: <PersonAddIcon sx={{ fontSize: 60, color:"#471396" }} />,
            path: "/cashier/register"
        }
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
                Cashier Dashboard
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
