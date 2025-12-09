import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "@/api/apiConfig.js";


export default function RedirectPage() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const navigate = useNavigate();

    useEffect(() => {
        async function sendCode() {
            if (!code) return;
            await api.get(`/api/google/redirect?code=${code}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }});
            navigate("/my-calendar");
        }
        sendCode();
    }, [code]);

    return null; // invisible
}