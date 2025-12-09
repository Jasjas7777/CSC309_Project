import { useState } from "react";
import {Paper, Typography, TextField, Box, Button,} from "@mui/material";
import NumberField from "@/components/NumberField";
import { createTransactions } from "@/api/apiConfig.js";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {enqueueSnackbar} from "notistack";

export default function CreateTransaction() {
    const [utorid, setUtorid] = useState("");
    const [amount, setAmount] = useState(0);
    const [promotionId, setPromotionId] = useState("");
    const [remark, setRemark] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!utorid) {
            enqueueSnackbar("Customer UTORID is required.", { variant: "error" });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                utorid,
                type: "purchase",
                spent: Number(amount),
                remark: remark || undefined,
                promotionId: promotionId ? Number(promotionId) : undefined,
            };

            await createTransactions(payload);
            enqueueSnackbar("Transaction created successfully!", { variant: "success" });

            // Reset form
            setUtorid("");
            setAmount(0);
            setPromotionId("");
            setRemark("");

        } catch (err) {
            console.error("Failed to create transaction:", err);
        }
        setLoading(false);
    };

    return (
        <div>
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                <Button
                    startIcon={<ArrowBackIosNewIcon />}
                    onClick={() => navigate("/cashier/dashboard")}
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
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    color="primary"
                    mb={3}
                >
                    Create Transaction
                </Typography>

                {/* Customer UTORID */}
                <Box mb={3}>
                    <TextField
                        fullWidth
                        value={utorid}
                        label="Customer utorid"
                        onChange={(e) => setUtorid(e.target.value)}
                        placeholder="Enter customer UTORID"
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                        }}
                    />
                </Box>

                {/* Amount */}
                <Box mb={3}>
                    <NumberField
                        value={amount}
                        min={0}
                        label="Amount Spent"
                        onValueChange={(val) => setAmount(val ?? 0)}
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            width: "100%",
                            "& fieldset": { border: "none" },
                        }}
                    />
                </Box>

                {/* Promotion ID (optional) */}
                <Box mb={3}>
                    <Box display="flex" justifyContent="flex-end">
                        <Typography fontSize={13} color="gray">
                            (optional)
                        </Typography>
                    </Box>
                    <TextField
                        fullWidth
                        label="Promotion ID"
                        value={promotionId}
                        onChange={(e) => setPromotionId(e.target.value)}
                        placeholder="Enter promotion ID"
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                        }}
                    />
                </Box>

                {/* Remark */}
                <Box mb={3}>
                    <Box display="flex" justifyContent="flex-end">
                        <Typography fontSize={13} color="gray">
                            (optional)
                        </Typography>
                    </Box>
                    <TextField
                        fullWidth
                        label="Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Add a remark"
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                >
                    {loading ? "Submitting..." : "Create Transaction"}
                </Button>
            </Paper>
        </div>

    );
}
