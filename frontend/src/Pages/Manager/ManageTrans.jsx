import {Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, Button, FormControl, InputLabel, Select, MenuItem, Pagination, TextField} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditTransDialog from "@/components/EditTransDialog.jsx";


import { useState, useEffect } from "react";
import { getTransactionsList, getTransaction } from "@/api/apiConfig.js";
import { getPromotionsList } from "@/api/apiConfig.js";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function ManageTrans() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [count, setCount] = useState(0);

    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState("all");


    const [selectedTx, setSelectedTx] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [promotions, setPromotions] = useState([]);


    // Load table data
    async function load() {
        try {
            const params = {
                page,
                limit: 5,
                sortBy,
                order
            };

            if (filterType !== "all") params.type = filterType;

            const res = await getTransactionsList(params);
            setTransactions(res.data.results);
            setCount(res.data.count);
        } catch (err) {
            console.error("Failed to load transactions:", err);
        }
    }
    useEffect(() => {
        load();
    }, [page, sortBy, order, filterType]);

    // Open details dialog
    const handleOpenDetail = async (transactionId) => {
        try {
            const res = await getTransaction(transactionId);
            setSelectedTx(res.data);
            setDetailOpen(true);
        } catch (err) {
            console.error("Failed to load transaction:", err);
        }
    };

    const handleDetailClose = async () => {
        setDetailOpen(false);
        setSelectedTx(null);
        await load();
    };

    useEffect(() => {
        async function loadPromotions() {
            try {
                const res = await getPromotionsList({ page: 1, limit: 100 });
                setPromotions(res.data.results);
            } catch (err) {
                console.error("Failed to load promotions", err);
            }
        }

        loadPromotions();
    }, []);


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
                    width: "85%",
                    mx: "auto",
                }}>
                <Typography variant="h4" fontWeight={700} mb={3} color="primary">
                    Transaction Management
                </Typography>

                {/* Filter + Sort */}
                <Box
                    display="flex"
                    gap={3}
                    mb={2}
                    sx={{flexDirection: { xs: "column", md: "row" },}}
                >
                    <FormControl size="small">
                        <InputLabel>Filter by Type</InputLabel>
                        <Select
                            value={filterType}
                            label="Filter by Type"
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                setPage(1);
                            }}
                            sx={{ width: 180 }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="purchase">Purchase</MenuItem>
                            <MenuItem value="adjustment">Adjustment</MenuItem>
                            <MenuItem value="transfer">Transfer</MenuItem>
                            <MenuItem value="redemption">Redemption</MenuItem>
                            <MenuItem value="event">Event</MenuItem>
                        </Select>
                    </FormControl>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,                // spacing between dropdown and icon
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

                {/* TABLE */}
                <Paper>
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
                                <TableCell>amount</TableCell>
                                <TableCell>type</TableCell>
                                <TableCell>spent</TableCell>
                                <TableCell>suspicious</TableCell>
                                <TableCell>createdBy</TableCell>
                                <TableCell>View/Edit</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {transactions.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>{t.id}</TableCell>
                                    <TableCell>{t.utorid}</TableCell>
                                    <TableCell>{t.amount}</TableCell>
                                    <TableCell>{t.type}</TableCell>
                                    <TableCell>{t.spent ?? "-"}</TableCell>
                                    <TableCell>
                                        {t.suspicious ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell>{t.createdBy}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDetail(t.id)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </Box>
                </Paper>

                {/* Pagination */}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={Math.ceil(count / 5)}
                        page={page}
                        onChange={(e, v) => setPage(v)}
                    />
                </Box>

                <EditTransDialog
                    open={detailOpen}
                    onClose={handleDetailClose}
                    transaction={selectedTx}
                    refreshTable={() => load()}
                    promotionOptions={promotions}
                />

            </Paper>
        </div>

    );
}
