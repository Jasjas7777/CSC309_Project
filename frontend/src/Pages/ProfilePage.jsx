import { useState, useRef, useEffect } from "react";

import {Paper, Typography, Box, Avatar, Button, TextField, Divider, IconButton, FormControl, InputLabel, Input, InputAdornment} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { useAuth } from "../context/AuthContext";
import { updateMe, updateMyPassword } from "@/api/apiConfig.js";
import {enqueueSnackbar} from "notistack";


const readOnlyField = {
    "& .MuiInputLabel-root": {
        fontSize: "1.3rem",
        fontWeight: 600,
        color: "#5A2BBF",
    },

    "& .MuiInput-root": {
        borderRadius: "8px",
        paddingX: 1.2,
        paddingY: 0.8,
        cursor: "default",

        "&:before": { borderBottom: "none !important" },
        "&:after": { borderBottom: "none !important" },
        "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "none !important",
        },
    },

    "& .MuiInputBase-input": {
        color: "#666 !important",
        WebkitTextFillColor: "#666 !important",
    },
};


const viewModeEditable = {
    "& .MuiInputLabel-root": {
        fontSize: "1.3rem",
        fontWeight: 600,
        color: "#5A2BBF",
    },

    "& .MuiInput-root": {
        borderRadius: "8px",
        paddingX: 1.2,
        paddingY: 0.8,

        // remove underline
        "&:before": { borderBottom: "none" },
        "&:after": { borderBottom: "none" },
    },
};


const editModeEditable = {
    "& .MuiInputLabel-root": {
        fontSize: "1.3rem",
        fontWeight: 600,
        color: "#5A2BBF",
    },

    "& .MuiOutlinedInput-root": {
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        "& fieldset": { borderColor: "#B13BFF" },
        "&:hover fieldset": { borderColor: "#8F2FFF" },
        "&.Mui-focused fieldset": {
            borderColor: "#8F2FFF",
            boxShadow: "0 0 0 2px #E8D4FF"
        },
    },
};

function toDateOnly(value) {
    if (!value) return "";
    return value.split("T")[0];
}

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    if (!user) return null;

    const [editMode, setEditMode] = useState(false);

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        birthday: toDateOnly(user?.birthday),
        old: "",
        new: "",
    });

    const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || "");
    const fileInputRef = useRef(null);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const toggleShowOldPassword = () => {
        setShowOldPassword((prev) => !prev);
    };

    const [showNewPassword, setShowNewPassword] = useState(false);
    const toggleShowNewPassword = () => {
        setShowNewPassword((prev) => !prev);
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        handleChange("avatarFile", file);
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            let hasChanges = false;

            if (form.name !== user.name) {
                data.append("name", form.name);
                hasChanges = true;
            }

            if (form.email !== user.email) {
                data.append("email", form.email);
                hasChanges = true;
            }

            if (form.birthday !== toDateOnly(user.birthday)) {
                data.append("birthday", form.birthday);
                hasChanges = true;
            }

            if (form.avatarFile) {
                data.append("avatar", form.avatarFile);
                hasChanges = true;
            }

            if (!hasChanges) {
                enqueueSnackbar("No changes to save.", { variant: "error" });
                setEditMode(false);
                return;
            }

            await updateMe(data);
            await refreshUser();
            setAvatarPreview(user.avatarUrl || "");
            setEditMode(false);

        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };


    const handlePasswordChange = async () => {
        try {
            if (!form.old || !form.new) {
                enqueueSnackbar("Please enter both old and new password!", { variant: "error" });
                return;
            }

            await updateMyPassword(form.old, form.new);

            // Clear password fields after success
            setForm(prev => ({
                ...prev,
                old: "",
                new: ""
            }));

            enqueueSnackbar("Password reset successfully!", { variant: "success" });

        } catch (err) {
            console.error("Failed to change password:", err);
        }
    };


    const handleCancel = () => {
        setForm({
            name: user.name,
            email: user.email,
            birthday: user.birthday,
            oldPassword: user.password,
            password: "",
        });
        setAvatarPreview(user.avatarUrl || "");
        setEditMode(false);
    };

    const editableStyle = (editMode ? editModeEditable : viewModeEditable);

    useEffect(() => {
        setAvatarPreview(user.avatarUrl || "");
    }, [user]);

    console.log(avatarPreview)

    return (
        <Paper sx={{
            p: 4,
            mt: 5,
            borderRadius: 3,
            maxWidth: 900,
            mx: "auto",
        }}>

            {/* HEADER */}
            <Box display="flex" justifyContent="center">
                <Box>
                    <Typography variant="h5" fontWeight={700} color="primary">
                        My Profile
                    </Typography>
                    <Typography color="text.secondary">
                        View and manage your personal information
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Profile */}
            <Box display="flex" gap={4}>
                {/* Avatar */}
                <Box textAlign="center">
                    <Avatar src={avatarPreview ? `${import.meta.env.VITE_BACKEND_URL}${avatarPreview}` : null}
                            sx={{
                                width: 90,
                                height: 90,
                                fontSize: 45,
                            }}
                    >
                        {user.name?.[0]}
                    </Avatar>

                    {editMode && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                hidden
                                onChange={handleAvatarUpload}
                            />
                            <Button
                                startIcon={<PhotoCameraIcon />}
                                onClick={() => fileInputRef.current.click()}
                                sx={{ mt: 1 }}
                            >
                                Upload new avatar
                            </Button>
                        </>
                    )}
                </Box>

                {/* Name + Email */}
                <Box mt={2}>
                    <Typography variant="h5" fontWeight={600} textAlign="left">
                        {user.name}
                        <Box
                            sx={{
                                mb: -1,
                                ml: 2,
                                px: 1.4,
                                py: 0.3,
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                bgcolor: "#471396",
                                color: "#fff",
                                display: "inline-block",
                            }}
                        >
                            {user.role}
                        </Box>
                    </Typography>
                    {/* Role Chip */}
                    <Typography color="text.secondary" textAlign="left">{user.email}</Typography>
                </Box>
            </Box>


            {/* Basic Information */}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Basic Information</Typography>
                {!editMode ? (
                    <Button variant="contained" onClick={() => setEditMode(true)}>
                        Edit Profile
                    </Button>
                ) : (
                    <Box display="flex" gap={2}>
                        <Button variant="contained" onClick={handleSave}>
                            Save Changes
                        </Button>
                        <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>


            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mt={2}>


                {/* User ID (NEVER editable) */}
                <TextField
                    label="User ID"
                    value={user.id}
                    InputProps={{ readOnly: true }}
                    sx={readOnlyField}
                    variant="standard"
                />

                {/* utorid */}
                <TextField
                    label="utorid"
                    value={user.utorid}
                    InputProps={{ readOnly: true }}
                    sx={readOnlyField}
                    variant="standard"
                />

                {/* Name */}
                <TextField
                    label="Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    sx={editableStyle}
                    variant="standard"
                />

                {/* Email */}
                <TextField
                    label="Email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    sx={editableStyle}
                    variant="standard"
                />

                {/* Birthday */}
                <TextField
                    type="date"
                    label="Birthday"
                    value={toDateOnly(form.birthday)}
                    onChange={(e) => handleChange("birthday", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: !editMode }}
                    sx={editableStyle}
                    variant="standard"
                />
            </Box>

            {/* Account Information */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" textAlign="left">Account</Typography>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mt={2}>
                <TextField
                    label="Points Balance"
                    value={user.points}
                    InputProps={{ readOnly: true }}
                    sx={readOnlyField}
                    variant="standard"
                />

                <TextField
                    label="Verification Status"
                    value={user.verified ? "Verified" : "Not Verified"}
                    InputProps={{ readOnly: true }}
                    sx={readOnlyField}
                    variant="standard"
                />
            </Box>

            {/* Password */}
            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Change Password</Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordChange}
                    sx={{ textTransform: "none" }}
                >
                    Reset Password
                </Button>

            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mt={2} mb={5}>
                <TextField
                    label="Old Password"
                    required
                    InputLabelProps={{ shrink: true }}
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Write the old password"
                    value={form.old}
                    onChange={(e) => handleChange("old", e.target.value)}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={toggleShowOldPassword}>
                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                    }}
                    sx={editableStyle}
                    variant="standard"
                />


                <TextField
                    label="New Password"
                    required
                    InputLabelProps={{ shrink: true }}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Write the new password"
                    value={form.new}
                    onChange={(e) => handleChange("new", e.target.value)}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={toggleShowNewPassword}>
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                    }}
                    sx={editableStyle}
                    variant="standard"
                />
            </Box>

        </Paper>
    );
}
