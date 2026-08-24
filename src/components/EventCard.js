import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";


// ✅ KOMPONEN CARD TERPISAH (INI YANG MEMPERBAIKI ERROR)
function EventItem({ item }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");



  const [events, setEvents] = useState([]);
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("EventDetail", { event: item })}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >

      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* ✅ TANGGAL */}
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>
            {new Date(item.date).getDate()}
          </Text>
        </View>


        <Image
          source={{ uri: 'http://192.168.50.150:8080/IKAPPNS/uploads/event/' + item.img_poster }}
          style={styles.image}
        />
        <Text style={styles.title}>{item.event_name}</Text>
        <Text style={styles.desc}>{item.fullDate} • {item.time}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function EventCard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [search, startDate, endDate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://192.168.50.150:8080/IKAPPNS/api/get_event.php",
        {
          params: {
            name: search,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      setEvents(response.data.data);
    } catch (error) {
      console.log("Gagal load event:", error);
    }
  };

  // // 🔥 AMBIL DATA DARI PHP
  // const fetchEvents = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://192.168.50.175:8080/IKAPPNS/api/get_event.php" // ganti IP sesuai XAMPP
  //     );

  //     setEvents(response.data.data);
  //   } catch (error) {
  //     console.log("Gagal load event:", error);
  //   }
  // };

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

      {/* LIST EVENT */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventItem item={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

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
                onPress={() => {
                  setStartDate("");
                  setEndDate("");
                  setFilterVisible(false);
                }}
                style={[styles.modalButton, { backgroundColor: "#999" }]}
              >
                <Text style={styles.modalBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilterVisible(false)}
                style={[styles.modalButton, { backgroundColor: "#005b96" }]}
              >
                <Text style={styles.modalBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ✅ TOMBOL TAMBAH EVENT */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("AddEvent")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f6ff" },
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  row: {
    justifyContent: "space-between",
  },

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
    elevation: 6,
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
    justifyContent: "space-between",
    marginTop: 10,
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "48%",
    marginBottom: 15,
    overflow: "hidden",
    elevation: 4,
  },

  image: { width: "100%", height: 140 },

  title: {
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 8,
    marginTop: 6,
  },

  desc: {
    fontSize: 11,
    paddingHorizontal: 8,
    color: "#555",
    marginTop: 2,
  },

  location: {
    fontSize: 11,
    paddingHorizontal: 8,
    color: "#777",
    marginBottom: 10,
  },

  dateBox: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#005b96",
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  dateText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

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
    zIndex: 100,
  },
});


