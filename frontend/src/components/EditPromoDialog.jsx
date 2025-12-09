import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import NumberField from "@/components/NumberField.jsx";

dayjs.extend(utc);

export default function EditPromoDialog({ open, onClose, promo, setPromo, onSave, createMode = false }) {
    if (!promo) return null;

    const handleChange = (key, value) => {
        setPromo((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{createMode ? "Create Promotion" : "Edit Promotion"}</DialogTitle>

            <DialogContent dividers>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={promo.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Description"
                    margin="normal"
                    multiline
                    value={promo.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />



                <Box sx={{ mt: 2, display: "flex", flexDirection: "row",  justifyContent: "space-between"}}>
                    <TextField
                        fullWidth
                        select
                        margin="normal"
                        label="Type"
                        value={promo.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                    >
                        <MenuItem value="automatic">Automatic</MenuItem>
                        <MenuItem value="one-time">One-Time</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        margin="normal"
                        type="number"
                        label="Rate"
                        value={promo.rate}
                        onChange={(e) => handleChange("rate", Number(e.target.value))}
                    />
                </Box>


                <Box sx={{ mt: 2, display: "flex", flexDirection: "row",  justifyContent: "space-between"}}>
                    <NumberField
                        label="Points"
                        value={promo?.points ?? 0}
                        onValueChange={(e) => setPromo({...promo, points: e})}
                    />
                    <NumberField
                        label="min spending"
                        value={promo?.minSpending ?? 0}
                        onValueChange={(e) => setPromo({...promo, minSpending: e})}
                    />
                </Box>


                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* startTime and endTime */}
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                        <DateTimePicker
                            label="Start Time"
                            slotProps={{ textField: { fullWidth: true } }}
                            value={promo.startTime ? dayjs(promo.startTime).utc() : null}

                            onChange={(newValue) =>
                                setPromo({
                                    ...promo,
                                    startTime: newValue ? newValue.utc().toISOString() : null,
                                })
                            }
                        />

                        <DateTimePicker
                            label="End Time"
                            slotProps={{ textField: { fullWidth: true } }}
                            value={promo.endTime ? dayjs(promo.endTime).utc() : null}

                            onChange={(newValue) =>
                                setPromo({
                                    ...promo,
                                    endTime: newValue ? newValue.utc().toISOString() : null,
                                })
                            }
                        />

                    </Box>
                </LocalizationProvider>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={onSave}>
                    {createMode ? "Create" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
