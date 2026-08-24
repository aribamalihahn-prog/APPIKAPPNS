import React, { useEffect, useState, useFocusEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const BASE_URL = "http://192.168.50.150:8080/IKAPPNS/uploads/profiles/";

const { width } = Dimensions.get("window");

export default function home() {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);


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

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("loggedInUser");
      const storeUser = await AsyncStorage.getItem("user_id");
      // console.log(stored);

      // // if (!stored) return;

      const profil = JSON.parse(stored);
      const user = JSON.parse(storeUser);
      setUser(user)
      // console.log(user);
      

      setProfile({
        name: profil.full_name,
        email: profil.email,
        phone: profil.phone,
        work: profil.job_title,
        company: profil.company,
        bio: profil.bio,
        address: profil.address,
        image: profil.profile_picture
          ? BASE_URL + profil.profile_picture
          : null,
      });
    } catch (error) {
      console.log("Gagal load profile:");
    }
  };

  // 🔹 LOAD SAAT PERTAMA MASUK
  useEffect(() => {
    loadProfile();
    // console.log(profile);

  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     loadProfile();
  //   }, [])
  // );

  const fetchArticles = async () => {
    try {
      const response = await fetch("https://ika.ppns.ac.id/");
      const html = await response.text();

      // Regex sederhana untuk ambil gambar, judul, dan link
      const regex = /<img[^>]+src="([^"]+)"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
      const matches = [];
      let match;

      while ((match = regex.exec(html)) !== null) {
        matches.push({
          image: match[1],
          link: match[2],
          title: match[3],
        });
      }

      setArticles(matches.slice(0, 10)); // ambil 10 berita pertama
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const extractArticleBody = (html) => {
  // Cari tag div dengan class entry-content atau content-area / article
  const match = html.match(/<div class="entry-content"[^>]*>([\\s\\S]*?)<\/div>/);
  if (match && match[1]) {
    return match[1];
  }
  // fallback ambil semua <p> jika entry-content tidak ditemukan
  const paras = [...html.matchAll(/<p[^>]*>(.*?)<\/p>/g)];
  return paras.map(m => `<p>${m[1]}</p>`).join("");
};

const openArticle = async (url, title) => {
  try {
    const detailRes = await fetch(url);
    const html = await detailRes.text();

    const bodyContent = extractArticleBody(html);

    router.push({
      pathname: "/WebViewDetail",
      params: {
        title: title,
        content: bodyContent,
      },
    });
  } catch (e) {
    console.log("Gagal load detail:", e);
  }
};

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openArticle(item.link, item.title)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
{/* 
        <View style={styles.iconRow}>
          <View style={styles.iconGroup}>
            <Ionicons name="thumbs-up-outline" size={18} color="#555" />
            <Text style={styles.iconText}>5</Text>
          </View>
          <View style={styles.iconGroup}>
            <Ionicons name="chatbubble-outline" size={18} color="#555" />
            <Text style={styles.iconText}>10</Text>
          </View> */}
        {/* </View> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eaf4ff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profil Section */}
        <View style={styles.profileCard}>
          <Image
            source={
              profile.image
                ? { uri: profile.image }
                : require("../../src/assets/images/profile.png")
            }
            style={styles.profilePic}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.subText}>{profile.phone}</Text>
            <Text style={styles.subText}>{user.program_study_name + ' - ' + user.force_year}</Text>
          </View>
        </View>

        {/* Menu atas */}
        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem}
            onPress={() => navigation.navigate("adartika")}>
            <Ionicons name="folder-outline" size={25} color="#005b96" />
            <Text style={styles.menuText}>AD ART</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}
            onPress={() => navigation.navigate("loker")}>
            <Ionicons name="briefcase-outline" size={25} color="#005b96" />
            <Text style={styles.menuText}>Vacancies</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}
            onPress={() => navigation.navigate("eventcard")}>
            <Ionicons name="megaphone-outline" size={25} color="#005b96" />
            <Text style={styles.menuText}>Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}
            onPress={() => navigation.navigate("donationcard")}>
            <Ionicons name="cash-outline" size={25} color="#005b96" />
            <Text style={styles.menuText}>Donation</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem}
            onPress={() => navigation.navigate("database")}>
            <Ionicons name="server-outline" size={25} color="#005b96" />
            <Text style={styles.menuText}>Database</Text>
          </TouchableOpacity> */}
        </View>

        {/* News Section */}
        <View style={styles.newsHeader}>
          <Text style={styles.newsTitle}>News IKA PPNS</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#005b96" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={articles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </ScrollView>

      {/*  Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate("Alumni")}>
        <Ionicons name="people-outline" size={24} color="#4b4343ff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="home-outline" size={24} color="#005b96" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Calender")}>
        <Ionicons name="calendar-outline" size={24} color="#4b4343ff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Ionicons name="person" size={24} color="#4b4343ff" />
      </TouchableOpacity>
    </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileCard: {
    backgroundColor: "#005b96",
    margin: 16,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 10,
  },
  profileInfo: { alignItems: "center" },
  name: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subText: { color: "#e0e0e0", fontSize: 12 },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  menuItem: {
    width: "20%",
    alignItems: "center",
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 10,
  },
  newsTitle: { fontWeight: "bold", fontSize: 16, color: "#000" },
  card: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 12,
    width: "90%",
    overflow: "hidden",
    elevation: 5,
    alignSelf: "center",
  },
  image: { width: "100%", height: 180 },
  cardContent: { padding: 12 },
  title: { fontWeight: "600", fontSize: 15, color: "#333", marginBottom: 10 },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconGroup: { flexDirection: "row", alignItems: "center" },
  iconText: { marginLeft: 4, color: "#555", fontSize: 12 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    height: 70,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    zIndex: 10,
  },
});

