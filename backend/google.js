const express = require("express");
const { google } = require("googleapis");
const jwtAuth = require("./middlewares/jwtAuth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const router = express.Router();
app.use(express.json());

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT
);

// Step 3 — START OAuth Login
router.get("/", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar"],
        prompt: "consent",
        redirect_uri: process.env.REDIRECT,
    });
    res.redirect(url);
});

// Step 4 — OAuth Callback
router.get("/redirect", jwtAuth, async (req, res) => {
    const code = req.query.code;

    // user info now available
    const utorid = req.user.utorid;

    const user = await prisma.user.findUnique({ where: { utorid } });
    if (!user) return res.status(404).json({ error: "User not found" });

    oauth2Client.getToken(code, async (err, tokens) => {
        if (err) return res.status(400).json({ error: "Token exchange failed" });

        oauth2Client.setCredentials(tokens);

        await prisma.user.update({
            where: { utorid },
            data: { googleRefreshToken: tokens.refresh_token },
        });

        res.send("Connected Google Calendar");
    });
});


router.get("/calendars", async (req, res) => {

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const events = await calendar.events.list({
        calendarId: "primary",
        singleEvents: true,
        orderBy: "startTime",
    });

    res.json(events.data.items);
});

//Add event to Google Calendar
async function addEventToGoogleCalendar(user, event) {
    if (!user.googleRefreshToken) return;

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    client.setCredentials({
        refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: client });

    const eventAdded = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
            summary: event.name,
            description: event.description,
            location: event.location,
            start: { dateTime: event.startTime },
            end: { dateTime: event.endTime },
        },
    });

    return eventAdded.data.id;
}

async function deleteEventFromGoogleCalendar(user, googleEventId) {
    if (!user.googleRefreshToken || !googleEventId) return;

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    client.setCredentials({
        refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: client });

    await calendar.events.delete({
        calendarId: "primary",
        eventId: googleEventId
    });
}



exports.router = router;
exports.addEventToGoogleCalendar = addEventToGoogleCalendar;
exports.deleteEventFromGoogleCalendar = deleteEventFromGoogleCalendar;

