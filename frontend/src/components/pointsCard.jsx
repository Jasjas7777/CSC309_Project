import {Paper, Box, Typography, Button, Dialog, DialogContent} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import {getMyInfo} from "../api/apiConfig.js";
import {useEffect, useState} from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/context/AuthContext.jsx";


export default function PointsCard() {
    const [open, setOpen] = useState(false);
    const [qrCode, setQRcode] = useState("");
    const { user } = useAuth();
    const points = user?.points ?? 0;


    const handleOpen = () => {
        // Generate a random QR content each time
        const randomCode = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        setQRcode(randomCode);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: "20px",
                overflow: "hidden",
                width: '100%',
            }}
        >
            <Box
                sx={{
                    p: 3,
                    background: "linear-gradient(90deg, #A020F0 0%, #3F51FF 100%)",
                    color: "white",
                    height: 150,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    textAlign: "left",
                }}
            >
                <Box>
                    <Typography variant="h7" sx={{ opacity: 0.9 }}>
                        Your Points Balance:
                    </Typography>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.1,
                            mt: 1,
                        }}
                    >
                        {points ?? 0}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    sx={{
                        bgcolor: "white",
                        color: "#471396",
                        width: "fit-content",
                        fontWeight: 600,
                        borderRadius: "10px",
                        textTransform: "none",
                        "&:hover": {
                            bgcolor: "#F2ECFF",
                        },
                    }}
                    startIcon={<QrCode2Icon />}
                    onClick={handleOpen}
                >
                    Show QR Code for Transaction
                </Button>
            </Box>
            {/* QR Code Popup */}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        p: 3,
                    }}
                >
                    <Typography variant="h7" sx={{ mb: 2 }}>
                        Scan This QR Code for Transaction
                    </Typography>
                    <QRCodeCanvas value={qrCode} size={200} />
                    <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                        Code: {qrCode}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
