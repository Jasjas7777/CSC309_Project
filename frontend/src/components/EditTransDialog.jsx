import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, Divider, TextField, MenuItem, FormControl, InputLabel, Select,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useState } from "react";
import { flagPromotions, createTransactions } from "@/api/apiConfig.js";

export default function EditTransDialog({
                                            open,
                                            onClose,
                                            transaction,
                                            refreshTable,
                                            promotionOptions = [] // optional promotion list passed from parent
                                        }) {
    if (!transaction) return null;

    const [adjustAmount, setAdjustAmount] = useState("");
    const [adjustRemark, setAdjustRemark] = useState("");
    const [adjustPromotions, setAdjustPromotions] = useState([]);


    const [suspiciousValue, setSuspiciousValue] = useState(transaction.suspicious);

    // Mark or Unmark Suspicious ----
    const handleToggleSuspicious = async () => {
        try {
            setSuspiciousValue((prev) => !prev);
            await flagPromotions(transaction.id, { suspicious: !suspiciousValue });
            refreshTable();
        } catch (err) {
            console.error("Error updating suspicious flag:", err);
        }
    };

    // ---- Create Adjustment Transaction ----
    const handleCreateAdjustment = async () => {
        if (!adjustAmount) return;

        try {
            await createTransactions({
                utorid: transaction.utorid,
                type: "adjustment",
                amount: Number(adjustAmount),
                relatedId: transaction.id,
                remark: adjustRemark || "",
                promotionIds: adjustPromotions
            });

            setAdjustAmount("");
            setAdjustRemark("");
            setAdjustPromotions([]);

            refreshTable();
        } catch (err) {
            console.error("Failed to create adjustment:", err);
        }
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}
            >
                Transaction Details
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pb: 3 }}>
                {/* ======================== TOP SUMMARY SECTION ======================== */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#F6F7F9",
                        mb: 3,
                        display: "grid",
                        rowGap: 1.2
                    }}
                >
                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Transaction ID</Typography>
                        <Typography fontWeight={600}>{transaction.id}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">User</Typography>
                        <Typography fontWeight={600}>{transaction.utorid}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Type</Typography>
                        <Typography fontWeight={600}>{transaction.type}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Amount</Typography>
                        <Typography fontWeight={600}>{transaction.amount}</Typography>
                    </Box>

                    {transaction.spent !== undefined && (
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Spent</Typography>
                            <Typography fontWeight={600}>{transaction.spent}</Typography>
                        </Box>
                    )}

                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Created By</Typography>
                        <Typography fontWeight={600}>{transaction.createdBy}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                        <Typography color="text.secondary">Suspicious</Typography>
                        <Typography fontWeight={600}>
                            {suspiciousValue ? "Yes" : "No"}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />

                {/* ======================== Adjustment Section ======================== */}
                <Typography variant="h6" fontWeight={700} mb={1}>
                    Make an Adjustment
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        fullWidth
                        label="Amount (+ / -)"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Remark"
                        value={adjustRemark}
                        onChange={(e) => setAdjustRemark(e.target.value)}
                    />
                </Box>

                {/* Promotion Selection (Optional) */}
                <Typography fontWeight={600} color="text.secondary" mb={1}>
                    Apply Promotions (Optional)
                </Typography>

                <Box
                    sx={{
                        maxHeight: 250,
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        p: 1,
                        mb: 2
                    }}
                >
                    {promotionOptions.length === 0 && (
                        <Typography color="text.secondary" textAlign="center">
                            No promotions available
                        </Typography>
                    )}

                    {promotionOptions.map((promo) => (
                        <Box
                            key={promo.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                px: 2,
                                py: 1.5,
                                borderBottom: "1px solid #f0f0f0",
                                cursor: "pointer",
                                height: "30%"
                            }}
                            onClick={() => {
                                setAdjustPromotions((prev) =>
                                    prev.includes(promo.id)
                                        ? prev.filter((id) => id !== promo.id)
                                        : [...prev, promo.id]
                                );
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={adjustPromotions.includes(promo.id)}
                                onChange={() => {}}
                            />
                            <Box>
                                <Typography fontWeight={600} textAlign="left">#{promo.id} {promo.name}</Typography>
                                <Typography fontWeight={500} textAlign="left">{promo.description}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>


                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        mb: 3,
                        bgcolor: "#000",
                        color: "#fff",
                        py: 1.2,
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#222" }
                    }}
                    disabled={!adjustAmount}
                    onClick={handleCreateAdjustment}
                >
                    Create Adjustment
                </Button>

                {/* ======================== Suspicious Toggle Button ======================== */}
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<WarningAmberIcon />}
                    sx={{
                        bgcolor: suspiciousValue ? "#838383" : "#D32F2F",
                        color: "#fff",
                        py: 1.2,
                        borderRadius: 2,
                        "&:hover": {
                            bgcolor: suspiciousValue ? "#6e6e6e" : "#b71c1c"
                        }
                    }}
                    onClick={handleToggleSuspicious}
                >
                    {suspiciousValue ? "Unmark as Suspicious" : "Mark as Suspicious"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
