import {Paper, Typography, Box, Select, MenuItem, Pagination,IconButton, FormControl, InputLabel} from "@mui/material"
import {useEffect, useState} from "react";
import {retriveTransactionsHistory} from "../api/apiConfig.js";
import TransactionCard from "../components/TransactionCard.jsx"
import {useAuth} from "../context/AuthContext.jsx"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";


export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState("asc");

    const [empty, setEmpty] = useState(false);

    const {user} = useAuth();

    async function fetchTransactions() {
        const params = {
            page,
            limit: 5,
            sortBy,
            order
        }

        //Set filters
        if (filter !== "all") {
            params.type = filter;
        }

        //Set sortBy
        params.sortBy = sortBy;
        params.order = order;

        try {
            const res = await retriveTransactionsHistory(params);
            const filtered = res.data.results.filter(txn =>
                txn.type !== "redemption" || txn.processed === true
            );

            setTransactions(filtered);

            setCount(res.data.count);
            setEmpty(res.data.count === 0);
        } catch (err) {
            console.error("Failed to fetch points:", err);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, [page, filter, sortBy, order]);

    return (
        <Paper elevation={1}
               sx={{
                   p: 3,
                   borderRadius: 3,
                   marginTop: 5,
        }}>
            <Box display="flex" gap={2} my={2} alignItems="center" sx={{marginTop: 0}}>
                <Typography variant="h5" fontWeight={700} color="primary" sx={{ flexGrow: 1 }} textAlign="left">
                    Transaction History
                </Typography>

                {/* Filter by type */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                        value={filter}
                        label="Filter"
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="all">All Transactions</MenuItem>
                        <MenuItem value="purchase">Purchase</MenuItem>
                        <MenuItem value="redemption">Redemption</MenuItem>
                        <MenuItem value="adjustment">Adjustment</MenuItem>
                        <MenuItem value="event">Event</MenuItem>
                        <MenuItem value="transfer">Transfer</MenuItem>
                    </Select>
                </FormControl>


                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="amount">Amount</MenuItem>
                        <MenuItem value="id">ID</MenuItem>
                    </Select>
                </FormControl>


                {/* Asc/Desc Toggle Button */}
                <IconButton onClick={() =>{
                    setOrder(order === "asc" ? "desc" : "asc");
                    setPage(1);
                }}>
                    {order === "asc"
                        ? <ArrowUpwardIcon />
                        : <ArrowDownwardIcon />}
                </IconButton>
            </Box>


            {/* Transactions */}
            {empty ? (
                <Typography color="text.secondary" mt={4} textAlign="center">
                    You don't have any transactions yet.
                </Typography>
            ) : (
                transactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={FormatTransaction(transaction)} />
                ))
            )}

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    count={Math.ceil(count / 5)}
                />
            </Box>


        </Paper>
    )
}

function FormatTransaction(txn) {
    const ui = {
        id: txn.id,
        type: txn.type,
        amount: txn.amount,
        title: capitalize(txn.type),
        subtitle: "",
    };

    if (txn.type === "purchase") {
        ui.subtitle = "Purchase";
    }

    if (txn.type === "adjustment") {
        ui.subtitle = `Adjustment of transaction ${txn.relatedId}`;
    }

    if (txn.type === "redemption") {
        ui.subtitle = `Redemption processed by cashier ${txn.relatedUtorid}`;
    }

    if (txn.type === "transfer") {
        const otherUtorid = txn.relatedUtorid;

        if (txn.amount < 0) {
            ui.subtitle = `Sent to ${otherUtorid}`;
        } else {
            ui.subtitle = `From ${otherUtorid}`;
        }
    }

    if (txn.type === "event") {
        ui.subtitle = `Event #${txn.relatedId}`;
    }

    return ui;
}


function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}