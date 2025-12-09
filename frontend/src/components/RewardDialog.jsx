import {Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, TextField, Paper, Button, Checkbox, Chip} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GiftIcon from "@mui/icons-material/CardGiftcard";
import { useState, useEffect } from "react";

export default function RewardDialog({open, onClose, selectedEvent, awardPointsToEvent}) {
    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");
    const [selected, setSelected] = useState([]);

    const attendees = selectedEvent?.guests || [];

    useEffect(() => {
        if (open) {
            setAmount("");
            setRemark("");
            setSelected([]);
        }
    }, [open]);

    const toggleSelect = (userId) => {
        setSelected((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    /** Award SELECTED attendees (one API call per selected user) */
    const handleAwardSelected = async () => {
        try {
            for (const userId of selected) {
                const user = attendees.find((u) => u.id === userId);
                if (!user) continue;

                await awardPointsToEvent({
                    type: "event",
                    amount: Number(amount),
                    remark: remark,
                    utorid: user.utorid
                })
            }

            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: 700 }}>
                Award Points – {selectedEvent?.name}
                <IconButton
                    sx={{ position: "absolute", right: 16, top: 16 }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>

                {/* Award Config */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                    <Typography fontWeight={700} mb={2}>
                        Award All
                    </Typography>

                    <TextField
                        fullWidth
                        type="number"
                        label="Points Amount"
                        placeholder="e.g., 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Remark"
                        placeholder="e.g., Participation bonus"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={!amount}
                        startIcon={<GiftIcon />}
                        sx={{ py: 1.4 }}
                        onClick={() => awardPointsToEvent({
                            type: "event",
                            amount: Number(amount),
                            remark: remark
                        })}
                    >
                        Award {amount || 0} Points to All Attendees ({attendees.length})
                    </Button>
                </Paper>

                <Box textAlign="center" my={2}>
                    <Typography variant="body2" color="text.secondary">
                        OR
                    </Typography>
                </Box>


                {/* Regular attendees */}
                <Typography fontWeight={700} mb={1}>
                    Select Individual Attendees
                </Typography>

                {attendees.map((user) => (
                    <Paper
                        key={user.id}
                        sx={{
                            p: 2,
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Checkbox
                                checked={selected.includes(user.id)}
                                onChange={() => toggleSelect(user.id)}
                            />

                            <Box>
                                <Typography fontWeight={600}>{user.name}</Typography>
                                <Typography variant="body2">{user.email}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}

                <Button
                    fullWidth
                    variant="contained"
                    disabled={!amount || selected.length === 0}
                    startIcon={<GiftIcon />}
                    sx={{ mt: 3, py: 1.4 }}
                    onClick={handleAwardSelected}
                >
                    Award {amount || 0} Points to {selected.length} Selected Attendees
                </Button>
            </DialogContent>
        </Dialog>
    );
}
