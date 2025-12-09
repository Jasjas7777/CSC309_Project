import Sidebar from "../components/sidebar.jsx";
import PointsCard from "../components/pointsCard.jsx";
import {Outlet, useLocation, matchPath} from "react-router-dom";
import {Box, Paper, useTheme} from "@mui/material";

export default function RegularLayout() {
    // Pages where points card not displayed
    const hidePointsOn = [
        "/profile",
        "/cashier/create",
        "/cashier/redeem",
        "cashier/register",
        "cashier/dashboard",
        "manager/dashboard",
        "/manager/events",
        "/manager/promotions",
        "/manager/transactions",
        "/manager/users",
        "/events",
        "/events/:id",
        "/promotions",
        "/organizer",
    ];
    const location = useLocation();
    const theme = useTheme();

    const hidePoints = hidePointsOn.some((pattern) =>
        matchPath(pattern, location.pathname)
    );


    return (
        <div className="regular-layout">
            {/*left sidebar*/}
            <aside className="sidebar">
                <Sidebar />
            </aside>

            {/*right side*/}
            <main style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <Paper sx={{
                    mx: "auto",
                    background: "transparent",
                    boxShadow: "none",
                    paddingLeft: "310px",
                    paddingRight: "30px",
                    paddingTop: "30px",
                    paddingBottom: "30px",
                    width: "100%",

                    [theme.breakpoints.down("md")]: {
                        paddingLeft: "30px",
                    },
                }}>
                    {/*Points card at the top*/}
                    {!hidePoints && (
                        <Box>
                            <PointsCard/>
                        </Box>
                    )}

                    {/*Content*/}
                    <Box sx={{width: "100%", mt: 0, px: 2, padding: 0}}>
                        <Outlet/>
                    </Box>
                </Paper>

            </main>

        </div>
    );
}