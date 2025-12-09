import { useEffect, useState } from "react";
import { Paper, Typography, Pagination, Box } from "@mui/material";
import PromotionCard from "../components/PromotionCard.jsx";
import { getPromotionsList } from "../api/apiConfig.js";

export default function Promotions() {
    const [promotions, setPromotions] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    const limit = 5;

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await getPromotionsList({
                    page,
                    limit,
                });

                setPromotions(res.data.results);
                setCount(res.data.count);
            } catch (err) {
                console.error("Failed to fetch promotions:", err);
            }
        };
        fetchPromotions();
    }, [page]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                mt: 5,
                borderRadius: 3,
                maxWidth: 900,
                mx: "auto",
            }}
        >
            {/* Title */}
            <Typography
                variant="h5"
                align="center"
                fontWeight={700}
                sx={{ mb: 4, color: "#5A2BBF" }}
            >
                Active Promotions
            </Typography>

            {/* Promotions List */}
            {promotions.length === 0 ? (
                <Typography align="center" color="text.secondary">
                    No active promotions.
                </Typography>
            ) : (
                promotions.map((promo) => <PromotionCard key={promo.id} promo={promo} />)
            )}

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    page={page}
                    count={Math.ceil(count / limit)}
                    onChange={(e, value) => setPage(value)}
                    sx={{ button: { color: "#5A2BBF" } }}
                />
            </Box>

        </Paper>
    );
}