import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx"
import {Paper, Button, Typography, Box, TextField, Snackbar, Alert} from "@mui/material"
import NumberField from '../components/NumberField.jsx';
import {createTransfer} from "../api/apiConfig.js";
import {enqueueSnackbar} from "notistack";


export default function Transfer() {
    const [Id, setId] = useState("");
    const [amount, setAmount] = useState(0);
    const [remark, setRemark] = useState("");
    const [success, setSuccess] = useState(false);
    const { user, loading, refreshUser } = useAuth();
    const [error, setError] = useState("");

    const handleTransfer = async () => {
        // Check required field
        if (!Id.trim()) {
            setError("Recipient ID is required.");
            enqueueSnackbar("Recipient ID is required.", { variant: "error" });
            return;
        }
        if (amount <= 0) {
            setError("Amount must be greater than 0.");
            enqueueSnackbar("Amount must be greater than 0.", { variant: "error" });
            return;
        }

        try {
            await createTransfer(Id, amount, remark);
            await refreshUser();

            // Reset fields
            setId("");
            setAmount(0);
            setRemark("");

            // Show success snackbar
            setSuccess(true);
            enqueueSnackbar("Transfer successfully!", { variant: "success" });
        } catch (err) {
            console.error("Transfer failed:", err);
        }
    };

    if (loading || !user) return null;
    const max_point = user.points;

    return (
        <Paper
            elevation={1}
            sx={{
                p: 4,
                borderRadius: 3,
                marginTop: 5,
                mx: "auto",
            }}
        >
            {/* Title */}
            <Typography
                variant="h5"
                fontWeight={700}
                align="center"
                color="primary"
                sx={{ mb: 4 }}
            >
                Transfer Points
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                {/* Recipient ID */}
                <TextField
                    label="Recipient’s ID"
                    placeholder="Enter recipient's ID"
                    value={Id}
                    onChange={(e) => setId(e.target.value)}
                    sx={{
                        backgroundColor: "#F4EEFF",
                        borderRadius: 2,
                        "& fieldset": { border: "none" },
                    }}
                />

                {/* Amount */}
                <NumberField
                    label="Amount"
                    min={1}
                    max={max_point}
                    value={amount}
                    onValueChange={(value) => setAmount(value ?? 0)}
                    sx={{
                        backgroundColor: "#F4EEFF",
                        borderRadius: 2,
                        "& fieldset": { border: "none" },
                    }}
                />

                {/* Remark */}
                <TextField
                    multiline
                    minRows={3}
                    label="Note"
                    placeholder="Optional message"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    sx={{
                        backgroundColor: "#F4EEFF",
                        borderRadius: 2,
                        "& fieldset": { border: "none" },
                    }}
                />

                {/* Transfer Button */}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleTransfer}
                >
                    Transfer
                </Button>
            </Box>

        </Paper>

    );
}