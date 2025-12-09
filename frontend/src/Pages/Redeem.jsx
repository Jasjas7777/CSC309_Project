import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx"
import {Paper, Button, Divider, Typography, Box, TextField, Pagination,} from "@mui/material"
import NumberField from '../components/NumberField.jsx';
import {requestRedemption, retriveTransactionsHistory} from "../api/apiConfig.js";
import PendingRedemptionCard from "../components/PendingRedemptionCard.jsx";
import QRCodeDialog from "../components/QRDialog.jsx";
import {enqueueSnackbar} from "notistack";

export default function Redeem() {
    const [amount, setAmount] = useState(0);
    const [remark, setRemark] = useState("")
    const [pending, setPending] = useState([]);
    const [openQR, setOpenQR] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);

    const { user, loading } = useAuth();


    async function fetchPending() {
        try {
            const res = await retriveTransactionsHistory({type: "redemption"});
            //Filter the pending redemption
            const pending = res.data.results.filter(
                txn => txn.processed === false || txn.processed === 'false'
            );
            setPending(pending);

        } catch (err) {
            console.error("Failed to load pending redemptions:", err);
        }
    }

    useEffect(() => {
        if (user) fetchPending();
    }, [user]);

    const handleSubmit = async () => {
        try {
            await requestRedemption(amount, remark);
            if (amount > user.points) {
                enqueueSnackbar("Not enough points", { variant: "error" });
                return
            }


            // reload pending redemptions
            await fetchPending();

            setAmount(0);
            setRemark("");
            enqueueSnackbar("Redemption request successfully make!", { variant: "success" });
        } catch (err) {
            console.error("Redemption request failed:", err);
        }
    };

    const handleOpenQR = (txn) => {
        setSelectedTxn(txn);
        setOpenQR(true);
    };

    if (loading || !user) return null;
    const max_point = user.points;

    return (
        <Paper elevation={1}
               sx={{
                   p: 3,
                   borderRadius: 3,
                   marginTop: 5,
                   display: "flex",
                   flexDirection: {
                       xs: "column",
                       sm: "row"
                   },
                   gap: 6,
               }}>

            {/* Left Side */}
            <Box sx={{ flex: 1, flexDirection:"column" }} display="flex" gap={1} >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{margin: 1}}>
                    Make a Redemption
                </Typography>
                <NumberField
                    label="Amount"
                    min={0}
                    defaultValue={100}
                    value = {amount}
                    onValueChange={(value) => setAmount(value ?? 0)}
                    sx={{
                        backgroundColor: "#f3eefc",
                        borderRadius: 2,
                        width: "300px",
                        "& fieldset": { border: "none" },
                        mb: 5,
                    }}
                />
                <TextField
                    label="Remark"
                    placeholder="e.g. Redeem for $20."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    multiline={true}
                    rows={3}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        mt: 1,
                        mb: 1,
                        backgroundColor: "#f3eefc",
                        borderRadius: 2,
                    }}
                />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Request
                </Button>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Right Side */}
            <Box sx={{ flex: 1, flexDirection:"column" }} display="flex" gap={1} >
                <Typography variant="h5" fontWeight={700} sx={{marginTop: 1}}>
                    Pending Redemption
                </Typography>
                <Typography variant="subtitle1" >
                    Show the QR code to a cashier to complete redemption
                </Typography>
                {pending.length === 0 ? (
                    <Typography color="text.secondary">No pending redemptions.</Typography>
                ) : (
                    pending.map((txn) => (
                        <PendingRedemptionCard
                            key={txn.id}
                            txn={txn}
                            onOpenQR={handleOpenQR}
                        />
                    ))
                )}

                <QRCodeDialog
                    open={openQR}
                    onClose={() => setOpenQR(false)}
                    txn={selectedTxn}
                />
            </Box>
        </Paper>
    )
}