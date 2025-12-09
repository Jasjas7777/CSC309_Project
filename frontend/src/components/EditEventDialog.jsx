import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import NumberField from "@/components/NumberField.jsx"

dayjs.extend(utc);

export default function EditEventDialog({open, onClose, selectedEvent, setSelectedEvent, onSave}) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit Event
                    <IconButton
                        sx={{ position: "absolute", right: 16, top: 16 }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {selectedEvent && (
                        <>
                            {/* Name */}
                            <TextField
                                label="Name"
                                fullWidth
                                sx={{ mt: 2 }}
                                value={selectedEvent.name}
                                onChange={(e) =>
                                    setSelectedEvent({ ...selectedEvent, name: e.target.value })
                                }
                            />

                            {/* Location */}
                            <TextField
                                label="Location"
                                fullWidth
                                sx={{ mt: 2 }}
                                value={selectedEvent.location}
                                onChange={(e) =>
                                    setSelectedEvent({...selectedEvent, location: e.target.value})
                                }
                            />

                            {/* startTime and endTime */}
                            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                <DateTimePicker
                                    label="Start Time"
                                    slotProps={{ textField: { fullWidth: true } }}
                                    value={selectedEvent.startTime ? dayjs(selectedEvent.startTime).utc() : null}

                                    onChange={(newValue) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            startTime: newValue ? newValue.utc().toISOString() : null,
                                        })
                                    }
                                />

                                <DateTimePicker
                                    label="End Time"
                                    slotProps={{ textField: { fullWidth: true } }}
                                    value={selectedEvent.endTime ? dayjs(selectedEvent.endTime).utc() : null}

                                    onChange={(newValue) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            endTime: newValue ? newValue.utc().toISOString() : null,
                                        })
                                    }
                                />

                            </Box>

                            {/* Capacity */}
                            <Box sx={{ mt: 2, display: "flex", flexDirection: "row",  justifyContent: "space-between"}}>
                                <NumberField
                                    label="Capacity"
                                    value={selectedEvent.capacity}
                                    onValueChange={(e) => setSelectedEvent({...selectedEvent, capacity: e})}
                                />

                            {/* Points */}
                                <NumberField
                                    label="Points"
                                    value={selectedEvent?.points ?? 0}
                                    onValueChange={(e) => setSelectedEvent({...selectedEvent, points: e})}
                                />
                            </Box>

                            {/* Description */}
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                sx={{ mt: 2 }}
                                value={selectedEvent.description}
                                onChange={(e) =>
                                    setSelectedEvent({
                                        ...selectedEvent,
                                        description: e.target.value})
                                }
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={onSave}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
