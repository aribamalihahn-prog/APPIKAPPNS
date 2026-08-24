import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation,useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatRupiah } from "../../utils/formatRupiah";


export default function DonationList() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event_id } = route.params;
  const [donations, setDonations] = useState([]);

// useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const response = await axios.get(
//           `http://192.168.50.241:8080/IKAPPNS/api/donation_get_by_event.php?event_id=${event_id}`
//         );

//         console.log("DATA DONASI:", response.data);

//         setDonations(response.data.data || []);
//       } catch (error) {
//         console.log("Gagal load donasi:", error);
//         Alert.alert("Error", "Tidak dapat memuat data dari server.");
//       }
//     };

//     fetchDonations();
//   }, [event_id]); 

useEffect(() => {
  const fetchDonations = async () => {
    try {
      const response = await axios.get(
        `http://192.168.50.150:8080/IKAPPNS/api/get_donation_by_event_id.php?event_id=${event_id}`
      );

      console.log("DATA DONASI:", response.data.data);
      setDonations(response.data.data || []);
    } catch (error) {
      console.log("Gagal load donasi:", error);
      Alert.alert("Error", "Tidak dapat memuat data dari server.");
    }
  };

  fetchDonations();
}, [event_id]);   // hanya jalan sekali
         
  return (
    <LinearGradient
      colors={["#ffffff", "#d2e5f7", "#b8d8f4"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#005b96" />
        </TouchableOpacity>
        <Text style={styles.headerTitleLeft}>Donatur</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.container}>
        {donations.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada donatur 😇</Text>
        ) : (
          donations.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>🎓 {item.program_study}</Text>
              <Text style={styles.detail}>📅 Angkatan {item.force_year}</Text>
              <Text style={styles.detail}>💰 {formatRupiah(item.amount_donation)}</Text>
              <Text style={styles.detail}>🎯 {item.goals}</Text>
              
              {/* ✅ BUKTI PEMBAYARAN */}
              {item.payment_proof && (
              <>
              <Text style={styles.proofLabel}>Bukti Pembayaran</Text>
              <Image
                    source={{
                      uri: "http://192.168.50.150:8080/IKAPPNS/" + item.payment_proof,
                    }}
                    style={styles.proofImage}
                    resizeMode="contain"
                  />
              </>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: "transparent",
},
  headerTitleLeft: {
  fontSize: 18,
  fontWeight: "600",
  color: "#005b96",
  marginLeft: 10,
},
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#005b96",
  },
  detail: {
    color: "#333",
    marginTop: 4,
  },
  proofLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },

  proofImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    marginTop: 40,
    fontSize: 15,
  },
});