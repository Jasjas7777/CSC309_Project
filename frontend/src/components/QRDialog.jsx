import { Dialog, DialogContent } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeDialog({ open, onClose, txn }) {
    if (!txn) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent
                sx={{
                    p: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <QRCodeCanvas
                    value={`redeem:${txn.id}`}
                    size={200}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                />
            </DialogContent>
        </Dialog>
    );
}