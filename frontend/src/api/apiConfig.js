import axios from "axios";
import { enqueueSnackbar } from "notistack";


// Set config defaults when creating the instance
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
        return config;
    });

// Response interceptor
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        const backendMessage = err.response?.data?.error;
        const defaultMessage = "Something went wrong. Please try again.";

        // Normalize message
        const message = backendMessage || defaultMessage;

        // 401 token invalid → redirect to login
        if (status === 401) {
            localStorage.removeItem("token");

            enqueueSnackbar("Your session has expired. Please log in again.", {
                variant: "warning",
            });

            window.location.href = "/login";
            return;
        }

        // Show snackbar for other ERROR
        enqueueSnackbar(message, { variant: "error" });

        return Promise.reject(err);
    }
);



//API from backend

////////Auth///////
export const login = (utorid, password) =>
    api.post("/auth/tokens", {utorid, password});

export const getResetToken = (utorid) =>
    api.post("/auth/resets", { utorid });

export const resetPassword = (resetToken, utorid, password) =>
    api.post(`/auth/resets/${resetToken}`, { utorid, password });

////////Users///////
export const registerUser = (data) =>
    api.post('/users', data);

export const getUserLists = (params) =>
    api.get("/users", { params });

export const getUser = (userId) =>
    api.get(`/users/${userId}`);

export const updateUser = (userId, data) =>
    api.patch(`/users/${userId}`, data);

export const updateMe = (formData) =>
    api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const getMyInfo = () =>
    api.get("/users/me");

export const updateMyPassword = (oldPassword, newPassword) =>
api.patch("/users/me/password", {
    old: oldPassword,
    new: newPassword
});

export const requestRedemption = (amount, remark) =>
    api.post("/users/me/transactions", {
        type: "redemption",
        amount,
        remark
    });

export const retriveTransactionsHistory = (params) =>
    api.get("/users/me/transactions", {params});

export const createTransfer = (userId, amount, remark)=>
    api.post(`/users/${userId}/transactions`, {
        type: "transfer",
        amount,
        remark
    });


////////Events///////
export const createEvent = (data) =>
    api.post("/events", data);

export const getEventList = (params) =>
    api.get("/events", { params });

export const getEvent = (eventId) =>
    api.get(`/events/${eventId}`);

export const joinEvent = (eventId) =>
    api.post(`/events/${eventId}/guests/me`);

export const updateEvent = (eventId, data) =>
    api.patch(`/events/${eventId}`, data);

export const quitEvent = (eventId) =>
    api.delete(`/events/${eventId}/guests/me`);

export const deleteEvent = (eventId) =>
    api.delete(`/events/${eventId}`);

export const addOrganizer = (eventId, utorid) =>
    api.post(`/events/${eventId}/organizers`, {utorid});

export const removeOrganizer = (eventId, userId) =>
    api.delete(`/events/${eventId}/organizers/${userId}`);

export const addGuest = (eventId, utorid) =>
    api.post(`/events/${eventId}/guests`, {utorid});

export const removeGuest = (eventId, userId) =>
    api.delete(`/events/${eventId}/guests/${userId}`);

export const createEventReward = (eventId, data) =>
    api.post(`/events/${eventId}/transactions`, data);


////////Promotion///////
export const createPromotions = (data) =>
    api.post("/promotions", data);

export const getPromotionsList = (params) =>
    api.get("/promotions", {params});

export const getPromotion = (promotionId) =>
    api.get(`/promotions/${promotionId}`);

export const updatePromotions = (promotionId, data) =>
    api.patch(`/promotions/${promotionId}`, data);

export const deletePromotions = (promotionId) =>
    api.delete(`/promotions/${promotionId}`);

////////Transactions///////
export const createTransactions = (data) =>
    api.post("/transactions", data);

export const getTransactionsList = (params) =>
    api.get("/transactions", {params});

export const getTransaction = (transactionId) =>
    api.get(`/transactions/${transactionId}`);

export const flagPromotions = (transactionId, suspicious) =>
    api.patch(`/transactions/${transactionId}/suspicious`, suspicious);

export const processRedemption = (transactionId) =>
    api.patch(`/transactions/${transactionId}/processed`, { processed: true });

export default api;