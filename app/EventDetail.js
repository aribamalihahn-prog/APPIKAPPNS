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
import { router } from "expo-router";



export default function EventDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params; // ✅ data dari EventCard

  return (
    <SafeAreaView style={styles.container}>

      {/* ✅ POSTER */}
      <View style={styles.imageWrapper}>
        <Image source={{uri : 'http://192.168.50.150:8080/IKAPPNS/uploads/event/'+event.img_poster}}
        style={styles.image} />

        {/* ✅ BULATAN TANGGAL */}
        <View style={styles.dateBox}>
                <Text style={styles.dateText}>
                {new Date(event.date).getDate()}
                </Text>
                </View>

        {/* ✅ TOMBOL BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ✅ ISI DETAIL */}
      <View style={styles.content}>
        <Text style={styles.title}>{event.event_name}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color="#555" />
          <Text style={styles.infoText}>{event.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={16} color="#555" />
          <Text style={styles.infoText}>{event.time} WIB</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color="#555" />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="card-outline" size={16} color="#555" />
        <Text style={styles.infoText}>{event.donation_account}</Text>
        </View>


        {/* ✅ DESKRIPSI */}
        <Text style={styles.sectionTitle}>Deskripsi Event</Text>
        <Text style={styles.description}>{event.description}</Text>

        {/* ✅ TOMBOL DONASI */}
<TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('donation', {event_id : event.id})}
>
  <Text style={styles.buttonText}>Donation</Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f6ff" },

  imageWrapper: { position: "relative" },

  image: { width: "100%", height: 260 },

  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  dateBox: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#005b96",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  dateText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  backButton: {
    position: "absolute",
    top: 16,
    left: 70,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 18,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
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
  backgroundColor: "#005b96",
  marginTop: 24,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  zIndex: 10,
  elevation: 10,
},


  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
