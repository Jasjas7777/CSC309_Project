import {
    Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography,
    Divider, Box, Button, Collapse
} from "@mui/material";
import logo from "../assets/Logo.png"
import {useState} from "react";
import { useMediaQuery, useTheme, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";


// Icons
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ReceiptIcon from "@mui/icons-material/Receipt";
import SendIcon from "@mui/icons-material/Send";
import PaidIcon from "@mui/icons-material/Paid";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import EventIcon from "@mui/icons-material/Event";
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from "@mui/icons-material/Logout";

//Dashboard
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

//Cashier
import AddBoxIcon from '@mui/icons-material/AddBox';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

//Manager
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import GroupsIcon from '@mui/icons-material/Groups';

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 280;

export default function Sidebar() {
    const { user, logout } = useAuth();
    if (!user) {
        return null;
    }

    const role = user?.role;
    const navigate = useNavigate();
    const [openCashier, setOpenCashier] = useState(false);
    const [openManager, setOpenManager] = useState(false);
    const isOrganizer = user.eventsOrganized?.length > 0;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Regular user links
    const regularLinks = [
        { to: "/profile", label: "Profile", icon: <AccountBoxIcon /> },
        { to: "/transactions", label: "Transactions", icon: <ReceiptIcon /> },
        { to: "/transfer", label: "Transfer", icon: <SendIcon /> },
        { to: "/redeem", label: "Redeem", icon: <PaidIcon /> },
        { to: "/promotions", label: "Promotions", icon: <CardGiftcardIcon /> },
        { to: "/events", label: "Events", icon: <EventIcon /> },
    ];

    const eventOrganizerLink = [
        { to: "/organizer", label: "My Organized Events", icon: <EventNoteIcon /> },
    ]


    // Cashier links
    const cashierLinks = [
        { to: "/cashier/dashboard", label: "Cashier Dashboard", icon:<FormatListBulletedIcon/> },
    ];

    const cashierSubLinks = [
        { to: "/cashier/redeem", label: "Process Redemption", icon: <VerifiedIcon /> },
        { to: "/cashier/create", label: "Create Transaction", icon: <AddBoxIcon /> },
        { to: "/cashier/register", label: "Register User", icon: <PersonAddIcon /> },
    ];

    const managerSubLinks = [
        {to: "/manager/users", label: "Manage Users", icon: <GroupsIcon sx={{ fontSize: 20 }} />},

        {to: "/manager/events", label: "Manage Events", icon: <EditCalendarIcon sx={{ fontSize: 20 }} />},

        {to: "/manager/promotions", label: "Manage Promotions", icon: <PriceChangeIcon sx={{ fontSize: 20 }} />
        },

        {to: "/manager/transactions", label: "Manage Transactions", icon: <EditDocumentIcon sx={{ fontSize: 20 }} />},
    ];


    // Manager links
    const managerLinks = [
        { to: "/manager/dashboard", label: "Manager Dashboard", icon:<FormatListBulletedIcon/>  },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Component to render each menu link
    const renderLink = (item) => (
        <ListItem key={item.to} disablePadding sx={{ py: 0.3 }}>
            <ListItemButton
                component={NavLink}
                to={item.to}
                sx={{
                    py: 0.5,
                    "&.active": { backgroundColor: "#E8DEF8" },
                    "&:hover": { color: "#B13BFF" },
                }}
            >
                <ListItemIcon sx={{ minWidth: 34 }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
            </ListItemButton>
        </ListItem>
    );


    const drawerContent = (
        <>
            {/* Sidebar Header */}
            <Box sx={{ px: 2, py: 3, display: "flex", flexDirection: "column", gap: 1.2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src={logo} alt="logo" width={220} />
                </Box>

                {/* User Info */}
                <Typography variant="subtitle1" fontWeight={600} mb={-0.8} textAlign="left">
                    {user?.name}
                    <Typography
                        component="span"
                        sx={{ color: "text.secondary", fontSize: "0.85rem", ml: 1 }}
                    >
                        #{user.id}
                    </Typography>
                </Typography>

                <Typography variant="body2" textAlign="left" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                    {user?.email}
                </Typography>

                <Box
                    sx={{
                        mb: -1,
                        px: 1.4,
                        py: 0.3,
                        borderRadius: "12px",
                        bgcolor: "#471396",
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "inline-block",
                        width: "fit-content"
                    }}
                >
                    {role}
                </Box>
            </Box>

            <Divider />

            <List>
                {regularLinks.map(renderLink)}
                {isOrganizer && eventOrganizerLink.map(renderLink)}

                <Divider />

                {(role === "cashier" || role === "manager" || role === "superuser") && (
                    <>
                        <ListItemButton
                            onClick={() => {
                                setOpenCashier(!openCashier);
                                navigate("/cashier/dashboard");
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 34 }}>
                                <FormatListBulletedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cashier Dashboard" />
                            {openCashier ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                        </ListItemButton>

                        <Collapse in={openCashier} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {cashierSubLinks.map(renderLink)}
                            </List>
                        </Collapse>
                    </>
                )}

                {(role === "manager" || role === "superuser") && (
                    <>
                        <Divider />

                        <ListItemButton
                            onClick={() => {
                                setOpenManager(!openManager);
                                navigate("/manager/dashboard");
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 34 }}>
                                <FormatListBulletedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Manager Dashboard" />
                            {openManager ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                        </ListItemButton>

                        <Collapse in={openManager} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {managerSubLinks.map(renderLink)}
                            </List>
                        </Collapse>
                    </>
                )}
            </List>

            <Divider />

            {/* Logout */}
            <Box sx={{ px: 2, pb: 2, mt: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    startIcon={<LogoutIcon />}
                    sx={{
                        borderColor: "#B13BFF",
                        color: "#5A2BBF",
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#F6F2FF",
                        "&:hover": {
                            borderColor: "#8F2FFF",
                            bgcolor: "#EDE1FF",
                            color: "#8F2FFF",
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>
        </>
    );

    return (
        <>
            {/* Mobile Hamburger Button */}
            {isMobile && (
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                        position: "fixed",
                        top: 16,
                        left: 16,
                        zIndex: 2000,
                        bgcolor: "#fff",
                        boxShadow: 2,
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": { width: drawerWidth },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </>
    );
}

