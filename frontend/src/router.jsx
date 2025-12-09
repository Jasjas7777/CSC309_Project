import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import RegularLayout from "./layouts/RegularLayout.jsx";

import Events from "./Pages/Events.jsx";
import EventDetail from "./Pages/EventDetail.jsx";
import Login from "./Pages/Login.jsx";
import Promotions from "./Pages/Promotions.jsx";
import Redeem from "./Pages/Redeem.jsx";
import Transactions from "./Pages/Transactions.jsx";
import Transfer from "./Pages/Transfer.jsx";
import Profile from "./Pages/ProfilePage.jsx"
import EventOrganizerPage from "@/Pages/EventOrganizerPage.jsx";

import CashierLandingPage from "@/Pages/Cashier/CashierLandingPage.jsx";
import CreateTransaction from "./Pages/Cashier/CreateTransaction.jsx";
import ProcessRedeem from "./Pages/Cashier/ProcessRedeem.jsx";
import RegisterUserPage from "./Pages/Cashier/RegisterUser.jsx"

import ManagerLandingPage from "@/Pages/Manager/ManagerLandingPage.jsx";
import ManageEvents from "./Pages/Manager/ManageEvents.jsx"
import ManagePromo from "./Pages/Manager/ManagePromo.jsx"
import ManageTrans from "./Pages/Manager/ManageTrans.jsx"
import ManageUsers from "./Pages/Manager/ManageUsers.jsx"

import RedirectPage from "./Pages/RedirectPage.jsx";
import MyCalendar from "@/Pages/MyCalendar.jsx";



const router = createBrowserRouter([
    {path: "/redirect", element: <RedirectPage/>},
    { path:"/my-calendar", element:<MyCalendar />},
    {path: "/login", element: <Login/>},
    {index: true, element: <Navigate to="/login"/>},
    {
        element: <RegularLayout/>,
        children: [
            //Regular users
            {path: "/profile", element: <Profile/>},
            {path: "/transactions", element: <Transactions/>},
            {path: "/promotions", element: <Promotions/>},
            {path: "/events", element: <Events/>},
            {path: "/events/:id", element: <EventDetail/>},
            {path: "/transfer", element: <Transfer/>},
            {path: "/redeem", element: <Redeem/>},
            {path: "/organizer", element:<EventOrganizerPage/> },

            //Cashier or higher
            {path: "/cashier/dashboard", element: <CashierLandingPage/>},
            {path: "/cashier/create", element: <CreateTransaction/>},
            {path: "/cashier/redeem", element: <ProcessRedeem/>},
            {path: "cashier/register", element: <RegisterUserPage/>},

            //Manager or higher
            {path: "/manager/dashboard", element: <ManagerLandingPage/>},
            {path: "/manager/events", element: <ManageEvents/>},
            {path: "/manager/promotions", element: <ManagePromo/>},
            {path: "/manager/transactions", element: <ManageTrans/>},
            {path: "/manager/users", element: <ManageUsers/>},
        ],
    },
]);

export default router;