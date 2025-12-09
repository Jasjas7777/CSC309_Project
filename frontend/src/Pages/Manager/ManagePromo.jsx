import { useEffect, useState } from "react";
import { Paper, Typography, Pagination, Box, Button } from "@mui/material";
import PromotionCard from "@/components/PromotionCard.jsx";
import EditPromoDialog from "@/components/EditPromoDialog.jsx";
import {
    getPromotionsList,
    getPromotion,
    createPromotions,
    updatePromotions,
    deletePromotions
} from "@/api/apiConfig";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {enqueueSnackbar} from "notistack";

export default function ManagePromo() {
    const navigate = useNavigate();
    const [promo, setPromo] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    const [editOpen, setEditOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [originalPromo, setOriginalPromo] = useState(null);

    const limit = 5;

    async function loadPromos() {
        try {
            const res = await getPromotionsList({ page, limit });
            setPromo(res.data.results);
            setCount(res.data.count);
        } catch (err) {
            console.error("Failed to fetch promotions:", err);
        }
    }

    useEffect(() => {
        loadPromos();
    }, [page]);

    const openEdit = async (promoId) => {
        try {
            const res = await getPromotion(promoId);
            setSelectedPromo(res.data);
            setOriginalPromo(res.data);
            setEditOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const payload = {};

            for (const key in selectedPromo) {
                // Ignore id field
                if (key === "id") continue;

                // Only include fields that were changed
                if (selectedPromo[key] !== originalPromo[key]) {
                    payload[key] = selectedPromo[key];
                }
            }

            // If no fields changed, just close dialog
            if (Object.keys(payload).length === 0) {
                setEditOpen(false);
                return;
            }

            await updatePromotions(selectedPromo.id, payload);

            setEditOpen(false);
            loadPromos();
            enqueueSnackbar("Update promotion successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    };


    const handleCreate = async () => {
        try {
            await createPromotions(selectedPromo);
            setCreateOpen(false);
            loadPromos();
            enqueueSnackbar("Create promotion successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (promoId) => {
        try {
            await deletePromotions(promoId);
            loadPromos();
            enqueueSnackbar("Delete promotion successfully!", { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                <Button
                    startIcon={<ArrowBackIosNewIcon />}
                    onClick={() => navigate("/manager/dashboard")}
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
            <Paper elevation={1} sx={{
                p: 4,
                borderRadius: 3,
                mt: 5,
                width: "85%",
                mx: "auto",
            }}>
                {/* Title */}
                <Box display="flex"
                     justifyContent="space-between"
                     paddingBottom={2}
                     sx={{
                         flexDirection: {
                             xs: "column",
                             sm: "row"
                         },
                     }}
                >
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 4, color: "#5A2BBF" }}>
                        Manage Promotions
                    </Typography>

                    <Button variant="contained"
                            sx={{
                                whiteSpace: "nowrap",

                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                height: { xs: 32, sm: 40 },
                                padding: { xs: "0 12px", sm: "0 20px" },
                                minWidth: { xs: "auto", sm: "100px" },
                            }}
                            onClick={() => {
                        setSelectedPromo({
                            name: "",
                            description: "",
                            type: "",
                            startTime: null,
                            endTime: null,
                            minSpending: "",
                            rate: "",
                            points: ""
                        });
                        setCreateOpen(true);
                    }}>
                        Create Promotion
                    </Button>
                </Box>

                {/* Promotion List */}
                {promo.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                        No promotions available.
                    </Typography>
                ) : (
                    promo.map((promo) => (
                        <PromotionCard
                            key={promo.id}
                            promo={promo}
                            manageMode
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}

                {/* Pagination */}
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        page={page}
                        count={Math.ceil(count / limit)}
                        onChange={(e, value) => setPage(value)}
                    />
                </Box>

                {/* Edit Dialog */}
                <EditPromoDialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    promo={selectedPromo}
                    setPromo={setSelectedPromo}
                    onSave={handleSaveEdit}
                />

                {/* Create Dialog */}
                <EditPromoDialog
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                    promo={selectedPromo}
                    setPromo={setSelectedPromo}
                    onSave={handleCreate}
                    createMode
                />
            </Paper>
        </div>

    );
}
