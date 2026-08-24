import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function Index() {
  const { loading, isLoggedIn } = useAuth();

  if (loading) return null; // bisa splash

  return isLoggedIn ? (
    <Redirect href="/profile" />
  ) : (
    <Redirect href="/login" />
  );
  
}
