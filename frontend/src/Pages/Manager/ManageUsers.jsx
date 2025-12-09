import {Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem, Avatar, Dialog, DialogTitle, DialogContent, Button, TextField, Select, FormControl, InputLabel, Pagination,} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

import { useState, useEffect } from "react";
import { getUserLists, getUser, updateUser } from "@/api/apiConfig.js";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {enqueueSnackbar} from "notistack";

const DEFAULT_AVATAR = "@assets/defaultAvatar.png";


export default function ManageUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [filterRole, setFilterRole] = useState("all");
    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(1);

    const [selectedUserId, setSelectedUserId] = useState(null);

    // Detail dialog states
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailUser, setDetailUser] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const params = {
                    page,
                    limit: 5,
                    order
                };

                // Filtering
                if (filterRole !== "all") params.role = filterRole;

                // Sorting
                params.sortBy = sortBy;
                params.order = order;
                const res = await getUserLists(params);
                let results = res.data.results;


                setUsers(results);
                setCount(res.data.count);
            } catch (err) {
                console.error("Failed to load users", err);
            }
        }
        load();
    }, [filterRole, sortBy,order, page]);

    const handleOpenDetails = async (userId) => {
        try {
            const res = await getUser(userId);
            setDetailUser(res.data);
            setDetailOpen(true);
        } catch (err) {
            console.error("Failed to load user details", err);
        }
    };



    const handleDetailClose = () => {
        setDetailOpen(false);
        setDetailUser(null);
    };

    const fetchUser = async () => {
        const params = {
            page,
            limit: 5,
        };
        const res = await getUserLists(params);
        setUsers(res.data.results);
    };

    const handleUpdateUser = async () => {
        try {
            await updateUser(detailUser.id, {
                email: detailUser.email,
                verified: detailUser.verified,
                role: detailUser.role,
            });
            handleDetailClose();
            await fetchUser();
            setPage(1); // reload
            enqueueSnackbar("Update user successfully!", { variant: "success" });
        } catch (err) {
            console.error("Failed to update user", err);
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

            <Paper
                elevation={1}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    mt: 5,
                    width: "80%",
                    mx: "auto",
                }}>
                <Box p={3}>
                    <Typography variant="h4" fontWeight={700} mb={3} color="primary">
                        User Management
                    </Typography>


                    {/* Filter / Sort */}
                    <Box
                        display="flex"
                        gap={3}
                        mb={2}
                        sx={{flexDirection: { xs: "column", md: "row" },}}
                    >
                        <FormControl size="small">
                            <InputLabel>Filter By</InputLabel>
                            <Select
                                value={filterRole}
                                label="Filter By"
                                onChange={(e) => setFilterRole(e.target.value)}
                                sx={{ width: 180 }}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="regular">Regular</MenuItem>
                                <MenuItem value="cashier">Cashier</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="superuser">Superuser</MenuItem>
                            </Select>
                        </FormControl>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                width: { xs: "100%", md: "auto" },
                            }}
                        >
                            <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem value="id">ID</MenuItem>
                                    <MenuItem value="points">Points</MenuItem>
                                    <MenuItem value="name">Name</MenuItem>
                                    <MenuItem value="utorid">utorid</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Asc/Desc Toggle Button */}
                            <IconButton
                                onClick={() => {
                                    setOrder(order === "asc" ? "desc" : "asc");
                                    setPage(1);
                                }}
                                sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    height: 38,
                                    width: 38,
                                }}
                            >
                                {order === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                            </IconButton>
                        </Box>

                    </Box>

                    <Paper elevation={1} sx={{
                        p: 4,
                        borderRadius: 3,
                        mt: 5,
                        mx: "auto",
                    }}>
                        <Box sx={{
                            overflowX: "auto",
                            width: "100%",
                            "&::-webkit-scrollbar": {
                                height: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#C7B4F7",
                                borderRadius: "8px",
                            }
                        }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>utorid</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Points</TableCell>
                                    <TableCell>Verified</TableCell>
                                    <TableCell>View/Change</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>{u.id}</TableCell>
                                        <TableCell>{u.utorid}</TableCell>
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.role}</TableCell>
                                        <TableCell>{u.points}</TableCell>
                                        <TableCell>{u.verified ? "Verified" : "Not Verified"}</TableCell>

                                        <TableCell>
                                            <IconButton onClick={() => handleOpenDetails(u.id)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </Box>
                    </Paper>

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={Math.ceil(count / 5)}
                            page={page}
                            onChange={(e, v) => setPage(v)}
                        />
                    </Box>


                    <Dialog open={detailOpen} onClose={handleDetailClose} maxWidth="sm" fullWidth>
                        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                            User Details
                            <IconButton onClick={handleDetailClose}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent>
                            {detailUser && (
                                <Box textAlign="center" mt={2}>
                                    <Avatar
                                        src={detailUser.avatarUrl || DEFAULT_AVATAR}
                                        sx={{ width: 90, height: 90, margin: "auto", mb: 1 }}
                                    />
                                    <Typography variant="h6">{detailUser.name}</Typography>

                                    {/* Editable Fields */}
                                    <Box mt={3}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={detailUser.email || ""}
                                            onChange={(e) =>
                                                setDetailUser({ ...detailUser, email: e.target.value })
                                            }
                                            sx={{ mb: 2 }}
                                        />

                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={detailUser.role}
                                                label="Role"
                                                onChange={(e) =>
                                                    setDetailUser({ ...detailUser, role: e.target.value })
                                                }
                                            >
                                                <MenuItem value="regular">Regular</MenuItem>
                                                <MenuItem value="cashier">Cashier</MenuItem>
                                                <MenuItem value="manager">Manager</MenuItem>
                                                <MenuItem value="superuser">Superuser</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel>Verified</InputLabel>
                                            <Select
                                                value={detailUser.verified}
                                                label="Verified"
                                                onChange={(e) =>
                                                    setDetailUser({ ...detailUser, verified: e.target.value })
                                                }
                                            >
                                                <MenuItem value={true}>Verified</MenuItem>
                                                <MenuItem value={false}>Not Verified</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{ mt: 1 }}
                                            onClick={handleUpdateUser}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </DialogContent>
                    </Dialog>
                </Box>
            </Paper>
        </div>


    );
}






