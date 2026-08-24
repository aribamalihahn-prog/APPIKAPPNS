import React from "react";
import { View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, Linking, 
  Alert, 
  ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";


export default function AlumniYear() {
  const route = useRoute();
  const navigation = useNavigation();
  const { program, year } = route.params;
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://192.168.50.150:8080/IKAPPNS/api/update_profile.php")
      .then((response) => {
        // Sesuaikan struktur data dari API
        setAlumniData(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetch data alumni:", error);
        Alert.alert("Gagal", "Tidak dapat mengambil data alumni.");
        setLoading(false);
      });
  }, []);

  // Fungsi buka WhatsApp
  const openWhatsApp = (phone) => {
    const url = `https://wa.me/${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Gagal", "WhatsApp tidak bisa dibuka.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error membuka WhatsApp", err));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#005b96" />
      </View>
    );
  }

    return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ffffff", "#d3e7f5", "#9fc6e7"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={26} color="#005b96" />
          </TouchableOpacity>
          <View>
            <Text style={styles.program}>{program}</Text>
            <Text style={styles.year}>{year}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            {alumniData.map((alumni, index) => (
              <View key={index} style={styles.alumniItem}>
                <Text style={styles.alumniName}>{alumni.name}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.alumniJob}>{alumni.pekerjaan}</Text>
                  <TouchableOpacity
                    onPress={() => openWhatsApp(alumni.phone)}
                    style={styles.phoneButton}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                    <Text style={styles.phoneText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#005b96",
  },
  year: {
    fontSize: 16,
    color: "#333",
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
  // bottomNav: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   alignItems: "center",
  //   backgroundColor: "#fff",
  //   borderTopWidth: 1,
  //   borderTopColor: "#ccc",
  //   height: 70,
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   elevation: 10,
  //   zIndex: 10,
  // },
});
