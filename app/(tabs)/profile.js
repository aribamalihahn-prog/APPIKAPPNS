import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "Nama Lengkap",
    email: "-",
    phone: "-",
    work: "-",
    company: "-",
    bio: "-",
    address: "-",
    image: null,
  });

  const [user, setUser] = useState({});

  const BASE_URL = "http://192.168.50.150:8080/IKAPPNS/uploads/profiles/";

  // 🔹 LOAD PROFILE DARI ASYNC STORAGE
  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("loggedInUser");
      const storedUser = await AsyncStorage.getItem("user_id");
      setUser(JSON.parse(storedUser));
      if (!stored) return;

      const u = JSON.parse(stored);

      // console.log(stored);

      setProfile({
        name: u.full_name || u.name || "Nama Lengkap",
        email: u.email || "-",
        phone: u.phone || "-",
        work: u.job_title || "-",
        company: u.company || "-",
        bio: u.bio || "-",
        address: u.address || "-",
        image: u.profile_picture
          ? BASE_URL + u.profile_picture
          : null,
      });
    } catch (error) {
      console.log("Gagal load profile:");
    }
  };

  // 🔹 LOAD SAAT PERTAMA MASUK
  useEffect(() => {
    loadProfile();
    // console.log(profile.image);
    
  }, []);

  // 🔹 LOAD SETIAP KEMBALI DARI EDIT PROFILE
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleEditProfile = () => {
    router.push("/editprofile");
  };

  const handleLogout = async () => {
    try {
     await AsyncStorage.clear();  // Hapus semua data login
      router.replace("/login");
    } catch (error) {
      alert("Gagal logout");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eaf4ff" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <Image
            source={
              profile.image
                ? { uri: profile.image }
                : require("../../src/assets/images/profile.png")
            }
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{(profile.name == "") ? profile.name : user.name}</Text>
            <Text style={styles.subText}>
              {profile.phone}
              {"\n"}
              {profile.work}
            </Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DETAIL CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Work</Text>
          <Text style={styles.value}>{profile.work}</Text>

          <Text style={styles.label}>Company</Text>
          <Text style={styles.value}>{profile.company}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{(profile.email == '-') ? user.email : profile.email}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{profile.address}</Text>

          <Text style={styles.label}>Bio</Text>
          <Text style={styles.value}>{profile.bio}</Text>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E9F3FF",
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: {
    color: "#005b96",
    fontSize: 20,
    fontWeight: "bold",
  },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "#005b96",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    color: "#e0e0e0",
    fontSize: 13,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  editText: {
    color: "#005b96",
    fontWeight: "bold",
  },

  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    elevation: 4,
  },

  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#005b96",
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },

  label: {
    fontWeight: "bold",
    color: "#005b96",
    marginTop: 10,
  },
  value: {
    color: "#333",
    fontSize: 15,
  },
});

