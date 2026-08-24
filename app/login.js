import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "../src/context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

// const handleLogin = async () => {
//   if (!email || !password) {
//     Alert.alert("Error", "Email dan password harus diisi.");
//     return;
//   }

//   try {
//     const res = await axios.post(
//       "http://192.168.50.241:8080/IKAPPNS/api/login.php",
//       { email, password },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     console.log("RESPON LOGIN:", res.data);

//     if (res.data.message === "Login success") {

//       await login(res.data.user);
//       await AsyncStorage.setItem(
//         "loggedInUser",
//         JSON.stringify(res.data.user)
//       );

//       Alert.alert("Sukses", "Login berhasil!");
//       router.replace("/profile");

//     } else {
//       Alert.alert("Login Gagal", res.data.message);
//     }

//   } catch (error) {
//     console.log("LOGIN ERROR:", error);
//     Alert.alert("Error", "Tidak bisa terhubung ke server.");
//   }
// };

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Email dan password harus diisi.");
    return;
  }

  try {
  const res = await axios.post(
    "http://192.168.50.150:8080/IKAPPNS/api/login.php",
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );

  if (res.data.message === "Login success") {
    
    const userId = res.data.user;
    // console.log(userId.id);
    

    //SIMPAN user_id dengan key yang benar
    await AsyncStorage.setItem("user_id", JSON.stringify(userId));

    // AMBIL PROFILE DARI BACKEND
    const profileRes = await axios.get(
      `http://192.168.50.150:8080/IKAPPNS/api/get_profile_by_user_id.php?user_id=${userId.id}`
    );

    // SIMPAN PROFILE DENGAN KEY YANG BENAR
    await AsyncStorage.setItem(
      "loggedInUser",
      JSON.stringify(profileRes.data.data)
    );

    // console.log("PROFILE DISIMPAN:", profileRes.data.data);

    Alert.alert("Sukses", "Login berhasil!");
    router.replace("/profile");

  } else {
    Alert.alert("Login Gagal", res.data.message);
  }

} catch (error) {
  // console.log("LOGIN ERROR:", error);
  Alert.alert("Error", "Tidak bisa terhubung ke server.");
}

};


  const handlebiodata = () => {
    // ✅ Arahkan ke halaman biodata
    router.push("/biodata");
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#ffffff", "#e6f2ff", "#b0d4f1"]} // gradasi putih ke biru muda
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBox}
    >

        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#ddd"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#ddd"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        {/* 🔹 Tambahan: Create Account */}
        <View style={styles.createContainer}>
          <Text style={styles.createText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handlebiodata}>
            <Text style={styles.createLink}> Create Account</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gradientBox: {
    width: "100%",
    maxWidth: 350,
    padding: 25,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005b96",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.7)"
  },
  forgotContainer: { alignSelf: "flex-end", marginBottom: 15 },
  forgotText: {
    color: "#fff",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#0077cc",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  loginText: { color: "#fff", fontWeight: "bold" },
  createContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  createText: { color: "#005b96" },
  createLink: { color: "#005b96", fontWeight: "bold", textDecorationLine: "underline" },
});
