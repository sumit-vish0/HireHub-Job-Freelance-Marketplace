import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });


    const [accessToken, setAccessToken] = useState(() => {

        return localStorage.getItem("accessToken");
    });


    const login = (userData, token) => {

        // Save first
        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "accessToken",
            token
        );

        // Then update React state
        setUser(userData);
        setAccessToken(token);
    };


    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
        setAccessToken(null);
    };


    const isAuthenticated =
        Boolean(user && accessToken);


    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);

}