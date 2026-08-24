import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // CEK USER SAAT APLIKASI DIBUKA
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("loggedInUser");

        // console.log(storedUser);
        

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("Auth load error:", error);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // FUNGSI LOGIN
  const login = async (userData) => {
    try {
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  // FUNGSI LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
