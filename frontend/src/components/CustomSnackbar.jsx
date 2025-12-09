import { SnackbarContent } from "notistack";
import { Box } from "@mui/material";
import { forwardRef } from "react";

const CustomSuccessSnackbar = forwardRef(({ message }, ref) => {
    return (
        <SnackbarContent ref={ref}>
            <Box
                sx={{
                    background: "linear-gradient(90deg, #A020F0 0%, #3F51FF 100%)",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: 600,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
            >
                {message}
            </Box>
        </SnackbarContent>
    );
})

const CustomErrorSnackbar = forwardRef(function CustomErrorSnackbar({ message }, ref) {
    return (
        <SnackbarContent ref={ref}>
            <Box
                sx={{
                    background: "linear-gradient(90deg, #FF3B30 0%, #FF6A5E 100%)",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: 600,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
            >
                {message}
            </Box>
        </SnackbarContent>
    );
})

export { CustomSuccessSnackbar, CustomErrorSnackbar };