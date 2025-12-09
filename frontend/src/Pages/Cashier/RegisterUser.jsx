import { useState } from "react";
import { Paper, Typography, TextField, Box, Button } from "@mui/material";
import { registerUser } from "@/api/apiConfig";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import {enqueueSnackbar} from "notistack";

export default function RegisterUser() {
    const [utorid, setUtorid] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!utorid || !name || !email) {
            setError("Please fill out all required fields.");
            enqueueSnackbar("Please fill out all required fields.", { variant: "error" });
            return;
        }

        try {
            await registerUser({
                utorid,
                name,
                email
            });

            setSuccess("User registered successfully!");

            // Reset form
            setUtorid("");
            setName("");
            setEmail("");
            enqueueSnackbar("Register user successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.error || "Failed to register user.");
        }
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
            <Box display="flex" justifyContent="center" mt={5}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        mt: 5,
                        width: "55%",
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent:"center",
                        gap: 3
                    }}
                >
                    <Typography variant="h5" fontWeight={700}  color={"primary"}>
                        Register New User
                    </Typography>

                    <TextField
                        label="UTORid"
                        value={utorid}
                        onChange={(e) => setUtorid(e.target.value)}
                        fullWidth
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                        }}
                    />

                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                        }}
                    />

                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        sx={{
                            backgroundColor: "#EFE7FF",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                        }}
                    />

                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {success && (
                        <Typography color="primary" variant="body2" sx={{ mb: 2 }}>
                            {success}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Create User
                    </Button>
                </Paper>
            </Box>
        </div>

    );
}

