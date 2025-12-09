import {Paper, TextField, Button, Container, Typography, Box} from "@mui/material"

import {useState} from "react";

import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import logo from "../assets/Logo.png"
import illustration from "../assets/login.jpg"
import {enqueueSnackbar} from "notistack";

export default function Login() {
    const { login } = useAuth();
    const [utorid, setUtorid] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function SubmitLogin(e) {
        e.preventDefault();
        setError("");

        if (!utorid.trim() || !password.trim()) {
            setError("UTORid and password are required.");
            enqueueSnackbar("Please fill out all required fields.", { variant: "error" });
            return;
        }

        try {
            const LoginSuccessfully = await login(utorid, password);
            if (LoginSuccessfully) navigate("/profile");
        } catch (err) {
            setError("Invalid UTORid or password.");
        }
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                height: "100vh",
                background: "#FFFFFF"
            }}
        >
            <div style={{
                width: "55%",
            }}>
                <img src={logo} alt="logo" width="40%"/>
                <img src={illustration} alt={""} width="100%"/>
            </div>
            <Box
                sx={{
                    padding: 4,
                    width: "100%",
                    maxWidth: 400,
                    marginLeft: 10,
                    marginTop: -30,
                    borderRadius: 3,
                    textAlign: "center",
                    background: 'rgba(255, 255, 255, 0.7)',
                }}
            >

                <Typography variant="h3" color={"primary"} fontWeight={600} mt={20} mb={2}>
                    Login
                </Typography>

                <form onSubmit={SubmitLogin}>
                    <TextField
                        fullWidth
                        label="UTORid"
                        value={utorid}
                        onChange={(e) => setUtorid(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />

                    {error && (
                        <Typography color="error" sx={{mt: 1}}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, py: 1.3}}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </div>
    );
}