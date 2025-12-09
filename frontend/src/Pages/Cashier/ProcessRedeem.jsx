import { useState } from "react";
import {Paper, Typography, TextField, Box, Button,} from "@mui/material";
import { processRedemption } from "@/api/apiConfig.js";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import {enqueueSnackbar} from "notistack";

export default function ProcessRedeem() {
    const [txnId, setTxnId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!txnId) {
            enqueueSnackbar("Redemption Transaction ID is required.", { variant: "error" });
            return;
        }

        setLoading(true);
        try {
            await processRedemption(txnId);
            enqueueSnackbar("Redemption processed successfully!", { variant: "success" });
            setTxnId("");
        } catch (err) {
            console.error("Process redemption failed:", err);
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
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:"center",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    color="primary"
                    mb={4}
                >
                    Process Redemption Request
                </Typography>


                {/* Input Field */}
                <Box mb={4}>

                    <TextField
                        value={txnId}
                        label="Redemption Transaction ID"
                        onChange={(e) => setTxnId(e.target.value)}
                        fullWidth
                        placeholder="Enter Redemption Transaction ID"
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                        }}
                    />
                </Box>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    width
                    onClick={handleSubmit}
                >
                    {loading ? "Processing..." : "Process Redemption"}
                </Button>
            </Paper>
        </div>

    );
}
