import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailLoker() {
  const route = useRoute();
  const navigation = useNavigation();
  const vacancy = route.params?.vacancy;

  console.log("DATA VACANCY:", vacancy);

  // Jika vacancy tidak terkirim
  if (!vacancy) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 20, color: "red" }}>
          Vacancy tidak ditemukan!
        </Text>
      </SafeAreaView>
    );
  }

  // URL Poster (antisipasi jika kosong)
  const posterURL = vacancy.img_poster
    ? `http://192.168.50.150:8080/IKAPPNS/uploads/vacancy/${vacancy.img_poster}`
    : "https://via.placeholder.com/400x300.png?text=No+Image";

  return (
    <SafeAreaView style={styles.container}>
      {/* POSTER */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: posterURL }} style={styles.image} />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* Company */}
        <Text style={styles.title}>
          {vacancy.company || "Nama perusahaan tidak tersedia"}
        </Text>

        {/* Position */}
        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={16} color="#555" />
          <Text style={styles.infoText}>
            {vacancy.position || "Posisi tidak tersedia"}
          </Text>
        </View>

        {/* Due Date */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.infoText}>
            {vacancy.due_date || "Tidak ada batas waktu"}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Deskripsi Pekerjaan</Text>
        <Text style={styles.description}>
          {vacancy.description || "Belum ada deskripsi."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f6ff" },

  imageWrapper: { position: "relative" },

  image: { width: "100%", height: 260 },

  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: -25,
    elevation: 5,
  },

  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },

  infoText: { fontSize: 13, color: "#555" },

  sectionTitle: {
    marginTop: 18,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  button: {
    backgroundColor: "#2563eb",
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
