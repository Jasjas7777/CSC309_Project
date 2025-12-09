import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import NumberField from "@/components/NumberField.jsx"

dayjs.extend(utc);

export default function CreateEventDialog({open, onClose, newEvent, setNewEvent, onSave}) {
    console.log(newEvent.startTime);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Create New Event
                    <IconButton
                        sx={{ position: "absolute", right: 16, top: 16 }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 3, textAlign: "left" }}>
                    {/* Name */}
                    <Typography>Name</Typography>
                    <TextField
                        fullWidth
                        sx={{ mb: 2, mt: 1 }}
                        value={newEvent.name}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, name: e.target.value })
                        }
                    />

                    {/* Location */}
                    <Typography>Location</Typography>
                    <TextField
                        fullWidth
                        sx={{ mt: 1 }}
                        value={newEvent.location}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, location: e.target.value })
                        }
                    />

                    {/* Start Time and End Time*/}
                    <Box display="flex" gap={2} mb={2} mt={2}>
                        <DateTimePicker
                            label="Start Time"
                            slotProps={{ textField: { fullWidth: true } }}
                            value={newEvent.startTime? dayjs(newEvent.startTime) : null}
                            onChange={(newValue) =>
                                setNewEvent({
                                    ...newEvent,
                                    startTime: newValue ? newValue.utc().toISOString() : null,
                                })
                            }
                        />
                        <DateTimePicker
                            label="End Time"
                            slotProps={{ textField: { fullWidth: true } }}
                            value={newEvent.endTime? dayjs(newEvent.endTime) : null}
                            onChange={(newValue) =>
                                setNewEvent({
                                    ...newEvent,
                                    endTime: newValue ? newValue.utc().toISOString() : null,
                                })
                            }
                        />
                    </Box>

                    {/* Capacity and Points */}
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "row",  gap: 2, mb: 2}}>
                        {/* Capacity */}
                        <NumberField
                            label="Capacity"
                            sx={{ flex: 1 }}
                            value={newEvent.capacity}
                            fullWidth
                            required={false}
                            onValueChange={(value) => setNewEvent({...newEvent, capacity: value === "" ? "" : value,})}
                        />

                        {/* Points */}
                        <NumberField
                            label="Points"
                            sx={{ flex: 1 }}
                            value={newEvent?.points ?? 0}
                            fullWidth
                            onValueChange={(e) => setNewEvent({...newEvent, points: e})}
                        />
                    </Box>

                    {/* Description */}
                    <Typography>Description</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2, mt: 1 }}
                        value={newEvent.description}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, description: e.target.value })
                        }
                    />

                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            py: 1.5,
                            backgroundColor: "#0B0B17",
                            "&:hover": { backgroundColor: "#000" },
                        }}
                        onClick={onSave}
                    >
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
