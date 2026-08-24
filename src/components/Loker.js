import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";



// ====== ITEM CARD =======
function JobItem({ item }) {
  const navigation = useNavigation();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("DetailLoker", { vacancy: item })}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Image
          source={{
            uri: `http://192.168.50.150:8080/IKAPPNS/uploads/vacancy/${item.img_poster}`,
          }}
          style={styles.image}
        />

        <Text style={styles.title}>{item.position}</Text>
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.due}>Deadline: {item.due_date}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}


// ===== MAIN COMPONENT ======
export default function JobCard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  // 🔥 filter state
  const [filterVisible, setFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://192.168.50.150:8080/IKAPPNS/api/get_vacancy.php",
        {
          params: {
            company: search,
            position: search,
            start_due_date: startDate,
            end_due_date: endDate,
          },
        }
      );

      setJobs(res.data.data || []);
    } catch (error) {
      console.log("ERROR Load Jobs:", error);
    }
  };

  // Auto refresh saat halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [search, startDate, endDate])
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* ===== SEARCH + FILTER ===== */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#777" style={{ marginRight: 8 }} />

          <TextInput
            placeholder="Cari posisi yang ingin dilamar..."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1 }}
          />
        </View>

        {/* FILTER BUTTON */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <JobItem item={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("AddLoker")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ==== FILTER MODAL ==== */}
      {filterVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Filter Tanggal</Text>

             {/* START DATE PICKER */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowStartPicker(true)}
            >
              <Text>{startDate || "Start Date"}</Text>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startDate ? new Date(startDate) : new Date()}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0];
                    setStartDate(formatted);
                  }
                }}
              />
            )}

            {/* END DATE PICKER */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEndPicker(true)}
            >
              <Text>{endDate || "End Date"}</Text>
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={endDate ? new Date(endDate) : new Date()}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0];
                    setEndDate(formatted);
                  }
                }}
              />
            )}


            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#999" }]}
                onPress={() => {
                  setStartDate("");
                  setEndDate("");
                  setFilterVisible(false);
                }}
              >
                <Text style={styles.modalBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#005b96" }]}
                onPress={() => setFilterVisible(false)}
              >
                <Text style={styles.modalBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}


// ====== STYLE ======
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f6ff" },
  listContainer: { paddingHorizontal: 12, paddingTop: 10 },
  row: { justifyContent: "space-between" },

  // search wrapper
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },

  filterButton: {
    backgroundColor: "#005b96",
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
    elevation: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "48%",
    marginBottom: 15,
    overflow: "hidden",
    elevation: 4,
  },

  image: { width: "100%", height: 120 },

  title: {
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 8,
    marginTop: 6,
  },

  company: {
    fontSize: 12,
    paddingHorizontal: 8,
    color: "#444",
    marginTop: 2,
  },

  due: {
    fontSize: 11,
    paddingHorizontal: 8,
    color: "#d9534f",
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 4,
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#005b96",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  modalActions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },

  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },

  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
