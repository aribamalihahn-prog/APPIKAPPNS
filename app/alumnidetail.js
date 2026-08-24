import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function AlumniDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { program, id } = route.params;

  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch alumni dari backend berdasarkan program


  useEffect(() => {

    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          `http://192.168.50.150:8080/IKAPPNS/api/get_alumni_by_program_study_id.php?program_study_id=${id}`
        );
        setAlumniData(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.log("Error fetch alumni:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlumni();
  }, []);

  // 🔥 Tombol buka WhatsApp
  const openWhatsApp = (phone) => {
    const phoneConvert = '62' + phone.slice(1);
    const url = `https://wa.me/${phoneConvert}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Gagal", "WhatsApp tidak bisa dibuka.");
        } else {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.log("Error membuka WhatsApp", err));
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ffffff", "#d3e7f5", "#9fc6e7"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={26} color="#005b96" />
          </TouchableOpacity>

          <Text style={styles.program}>{program}</Text>
        </View>

        {/* Loading */}
        {loading ? (
          <ActivityIndicator size="large" color="#005b96" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>

              {
                alumniData.length === 0 ? (
                  <Text style={styles.emptyText}>Belum ada data alumni</Text>
                ) : (
                  alumniData.map((alumni, index) => (
                    <View key={index} style={styles.alumniItem}>
                      <Text style={styles.alumniName}>{alumni.full_name}</Text>

                      <View style={styles.infoRow}>
                        <Text style={styles.alumniJob}>{alumni.job_title + ' di ' + alumni.company}</Text>

                        <TouchableOpacity
                          onPress={() => openWhatsApp(alumni.phone)}
                          style={styles.phoneButton}
                        >
                          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                          <Text style={styles.phoneText}>Chat</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )
              }
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
    padding: 6,
  },
  program: {
    fontSize: 20,
    fontWeight: "700",
    color: "#005b96",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#f8f9fb",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alumniItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  alumniName: {
    color: "#005b96",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
  textAlign: "center",
  color: "#777",
  fontSize: 16,
  paddingVertical: 20,
},
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  alumniJob: {
    color: "#555",
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e7f9ef",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  phoneText: {
    color: "#25D366",
    fontWeight: "500",
    marginLeft: 5,
  },
});

