#!/usr/bin/env node
'use strict';

const port = process.env.PORT || 8080;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://csc309project-production-c129.up.railway.app",  // frontend
    "https://csc309project-production-17ba.up.railway.app"   // backend
];

app.use((req, res, next) => {
    console.log("Origin:", req.headers.origin);
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("CORS blocked: " + origin));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;


const userRoutes = require("./users");
const eventRoutes = require("./events");
const transactionRoutes = require("./transaction");
const promotionRoutes = require("./promotion");
const { router: googleRouter } = require("./google");

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/transactions", transactionRoutes);
app.use("/promotions", promotionRoutes);
app.use("/api/google", googleRouter);

const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, 'public/data/uploads')));

//auth/tokens Authenticate a user and generate a JWT token
app.post("/auth/tokens", async (req, res) => {
    const {utorid, password} = req.body;
    console.log("LOGIN BODY:", req.body);
    if (!utorid || !password || typeof utorid !== 'string' || typeof password !== 'string'){
        return res.status(400).json({"error": "Invalid payload"})
    }
    const user = await prisma.user.findUnique({where: {utorid: utorid}});
    if (!user) {
        return res.status(404).json({'error': "User not found"});
    }
    if (password !== user.password) {
        return res.status(401).json({'error': "Incorrect password"});
    }

    const token = jwt.sign({utorid: utorid}, SECRET_KEY, {expiresIn: '7d'});
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return res.status(200).json({"token": token, "expiresAt": expiresAt});
});

//auth/resets Request a password reset email
const reqList = {};

app.post("/auth/resets", async (req, res) => {
    const {utorid} = req.body;
    if (!utorid || typeof utorid !== 'string') {
        return res.status(400).json({"error": "Invalid payload"})
    }
    const user = await prisma.user.findUnique({where: {utorid: utorid}});
    if (!user) {
        return res.status(404).json({'error': "User not found"});
    }
    const expiresAt = new Date();
    const now = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    if (req.ip in reqList) {
        if (now - reqList[req.ip] < 60000) {
            return res.status(429).json({"error": "Too Many Requests"});
        }
    }
    reqList[req.ip] = now;
    const token = uuidv4();
    const updateUser = await prisma.user.update({where: {utorid: utorid},
        data: {
            expiresAt: expiresAt,
            resetToken: token
        }
    });
    return res.status(202).json({"expiresAt": expiresAt, "resetToken": token});
})

//auth/resets/:resetToken Reset the password of a user given a reset token
app.post("/auth/resets/:resetToken", async (req, res) => {
    const {utorid, password} = req.body;
    const {resetToken} = req.params;
    if (!utorid || !password || typeof utorid !== 'string' || typeof password !== 'string'){
        return res.status(400).json({"error": "Invalid payload"})
    }
    if (password.length < 8 ||
        password.length > 20 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[@$!%*?&]/.test(password)
    ) {
        return res.status(400).json({"error": "Invalid password"})
    }
    const token = await prisma.user.findMany({where: {resetToken: resetToken}});
    if (!token || token.length === 0) {
        return res.status(404).json({'error': "Reset Token not found"})
    }
    const user = await prisma.user.findUnique({where: {utorid: utorid}});
    if (!user) {
        return res.status(404).json({'error': "User not found"});
    }
    const now = new Date();
    if (user.resetToken !== resetToken) {
        return res.status(401).json({'error': "Token not matched"})
    } else if (user.expiresAt < now) {
        return res.status(410).json({'error': "Reset token expired"});
    }

    const updateUser = await prisma.user.update({where: {utorid: utorid},
        data: {
            password: password
        },
    });
    return res.sendStatus(200);
});


const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error(`cannot start server: ${err.message}`);
    process.exit(1);
});