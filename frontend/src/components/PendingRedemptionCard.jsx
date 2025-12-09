import { Box, Typography, IconButton } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";

export default function PendingRedemptionCard({ txn, onOpenQR }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                mt: 1,
                borderRadius: 2,
                border: "1px solid #eee",
            }}
        >
            {/* Left: Arrow + Amount */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontSize: 24 }}>↗</Typography>

                <Box>
                    <Typography fontWeight={600}>{txn.amount}</Typography>
                </Box>
            </Box>

            {/* Right: QR icon */}
            <IconButton onClick={() => onOpenQR(txn)}>
                <QrCode2Icon sx={{ fontSize: 28 }} />
            </IconButton>
        </Box>
    );
}
