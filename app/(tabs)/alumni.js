import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function alumni() {
  const navigation = useNavigation();
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET DATA dari Backend
  useEffect(() => {
    fetchProgramStudy();
  }, []);

  const fetchProgramStudy = async () => {
    try {
      const response = await axios.get(
        "http://192.168.50.150:8080/IKAPPNS/api/get_program_study.php"
      );

      if (response.data.success) {
        setProgramList(response.data.data); // asumsi data: [{id, name}]
      } else {
        alert("Gagal mengambil data program study");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradasi Putih ke Biru Muda */}
      <LinearGradient
        colors={["#ffffff", "#d3e7f5", "#9fc6e7"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Program Study</Text>
            <View style={styles.card}>
              {loading ? (
                <ActivityIndicator size="large" color="#005b96" />
              ) : (
                programList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("alumnidetail", {
                        program: item.name, id : item.id
                      })
                    }
                  >
                    <Text style={styles.programText}>
                      {item.program_name || item.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#005b96",
    marginBottom: 16,
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
  button: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  programText: {
    color: "#005b96",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
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