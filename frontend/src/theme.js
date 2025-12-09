import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#471396",   // darker purple
            light: "#B13BFF",  // lighter purple
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#FFCC00",   // gold
        },

    },

    components: {
        // ---------- GLOBAL BUTTON STYLE ----------
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "8px",
                },
                containedPrimary: {
                    backgroundColor: "#471396",
                    "&:hover": {
                        backgroundColor: "#B13BFF",
                    },
                },
            },
        },

        // ---------- GLOBAL TEXTFIELD STYLE ----------
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f2ecff",               // light purple background
                        "& fieldset": {
                            borderColor: "#471396",                 // border
                        },
                        "&:hover fieldset": {
                            borderColor: "#B13BFF",                 // hover
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#471396",                 // focus
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "#471396",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#B13BFF",
                    },
                },
            },
        },
    },
});

export default theme;
