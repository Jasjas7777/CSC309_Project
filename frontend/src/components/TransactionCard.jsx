import {Card, CardContent, Box, Typography} from "@mui/material"
import {ArrowCircleLeft, ArrowCircleRight, RemoveCircle, ChangeCircle, Event} from "@mui/icons-material";

export default function TransactionCard({transaction}) {
    const {type, id, title, subtitle, amount} = transaction;

    const styles = {
        purchase: {
            bg: "#DFF6DD",
            text: "#1A7F37",
            icon: <ArrowCircleLeft sx={{ color: "#2D9F3D" , scale: 1.5}} />
        },
        adjustment: {
            bg: "#FFF8D6",
            text: "#A68A00",
            icon: <ChangeCircle sx={{ color: "#C9A000", scale: 1.5 }} />
        },
        redemption: {
            bg: "#FFD6D6",
            text: "#D32F2F",
            icon: <RemoveCircle sx={{ color: "#D32F2F", scale: 1.5 }} />
        },
        transfer: {
            bg: "#FFE4F1",
            text: "#C2185B",
            icon: <ArrowCircleRight sx={{ color: "#C2185B", scale: 1.5 }} />
        },
        event: {
            bg: "#F2F2F2",
            text: "#424242",
            icon: <Event sx={{ color: "#616161", scale: 1.5 }} />
        }
    }[type];

    return (
        <Card
            elevation={3}
            sx={{
                mb: 2,
                backgroundColor: styles.bg,
                borderRadius: 3,
                height: 80,
                overflow: "hidden"
            }}
        >
            <CardContent sx={{padding: 1.5}}>
                <Box display="flex" alignItems="center" gap={3} marginLeft={1}>
                    {/* Icon bubble */}
                    {styles.icon}


                    {/* Text */}
                    <Box flexGrow={1}>
                        <Typography
                            fontWeight="bold"
                            variant="h6"
                            sx={{textAlign: "left"}}
                        >
                            {title} #{id}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{textAlign: "left"}}>
                            {subtitle}
                        </Typography>
                    </Box>

                    {/* Amount */}
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: styles.text, minWidth: 70, textAlign: "right" }}
                    >
                        {amount > 0 ? `+${amount}` : amount}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}