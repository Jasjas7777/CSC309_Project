import { createContext, useContext, useEffect, useState } from 'react'
import api from "../api/apiConfig";

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //Login
    async function login(utorid, password) {
        const res = await api.post("/auth/tokens", {utorid, password})
    
        const newToken = res.data.token;
        localStorage.setItem("token", newToken);
        setToken(newToken);

        // Load user profile right after login
        await loadUserProfile(newToken);

        return true;
      }


      // Logout
    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }

      //Load user profile
    async function loadUserProfile(currentToken = token) {
        if (!currentToken) {
          setUser(null);
          return;
        }
    
        try {
          const res = await api.get("/users/me");
          const profile = res.data;
          setUser(profile);
        } catch (err) {
          console.error("Error loading profile:", err);
          logout();
        }
        setLoading(false);
      }

    useEffect(() => {
        async function init() {
          if (token) {
            await loadUserProfile(token);
          }else {
            setLoading(false);
          }
        }
        init();
      }, [token]);

    if (loading) {
        return null;
    }

    const value = {
        token,
        user,
        loading,
        login,
        logout,
        refreshUser: loadUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
  }